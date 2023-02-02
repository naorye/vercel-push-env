/* eslint-disable no-console */
import { getConfig } from './config'
import { diffEnvVars, filterTarget, parseEnvFile } from './dotenv'
import { createVercelEnvVars, fetchVercelEnv, updateVercelEnvVars } from './vercel'

async function start() {
  const config = getConfig()

  const parsedEnvs = parseEnvFile(config)

  const vercelEnvs = await fetchVercelEnv(config)
  const vercelEnvsToValidate = filterTarget(vercelEnvs, config.targets)

  const { create, update } = diffEnvVars(vercelEnvsToValidate, parsedEnvs)

  console.log('Variables to create:')
  console.table(create)

  console.log('Variables to update:')
  console.table(update.map(({ origin, target }) => ({ id: origin.id, ...target })))

  await createVercelEnvVars(create, config)

  await updateVercelEnvVars(update, config)
}

start()

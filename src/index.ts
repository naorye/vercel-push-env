// const { dotEnvToObject, filterChangedValues } = require('./src/dotenv')
// const { validateConfig } = require('./validation')
// const { getVarsFromVercel, patchVercelVars, pushToVercel } = require('./src/vercel')
import { getConfig } from './utils/config'
import { parseEnvFile } from './utils/dotenv'
import { fetchVercelEnv, filterTarget } from './utils/vercel'

async function start() {
  //   try {
  const config = getConfig()

  const parsedEnvs = parseEnvFile(config.envFile)

  const vercelEnvs = await fetchVercelEnv(config)
  const vercelEnvsToValidate = filterTarget(vercelEnvs, config.targets)

  //     const changedVars = filterChangedValues(dotenv, vercelEnvsByTarget)

  //     if (changedVars.length) {
  //       const { responses, newVars } = await patchVercelVars(changedVars)
  //       if (responses.length) console.log('Updated variables (Vercel response):', responses)
  //       if (newVars.length) await pushToVercel(newVars)
  //     } else console.log('Nothing changed!')
  //     console.log('Script finished!')
  //     const eventPayload = JSON.stringify(github.context.payload, undefined, 2)
  //     console.log(`The event payload: ${eventPayload}`)
  //   } catch (err) {
  //     core.setFailed(err.message)
  //   }
}

start()

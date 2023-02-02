import fs from 'node:fs'

import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

import type { Config, EnvTarget, EnvVariable } from './types'

function parseEnvFile(config: Config) {
  const content = fs.readFileSync(config.envFile, 'utf8')

  const envVars = dotenv.parse(content)

  if (Object.keys(envVars).length === 0) {
    throw new Error(`No environment variables found in '${config.envFile}'.`)
  }

  try {
    const parsedEnvVars = dotenvExpand.expand({ ignoreProcessEnv: true, parsed: envVars })

    if (!parsedEnvVars.parsed || parsedEnvVars.error) {
      throw new Error('Unable to expand environment variables.')
    }

    const variables = Object.entries(parsedEnvVars.parsed).map<EnvVariable>(([key, value]) => ({
      key,
      value,
      targets: config.targets,
    }))
    return variables
  } catch (error) {
    throw new Error(`Unable to parse and expand environment variables in '${config.envFile}'.`, {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

function filterTarget<T extends EnvVariable>(envs: T[], targets: EnvTarget[]) {
  const targetsKey = targets.sort().join(',')

  const filtered = envs.filter((env) => env.targets.sort().join(',').includes(targetsKey))

  return filtered
}

function diffEnvVars<T extends EnvVariable>(origin: T[], target: EnvVariable[]) {
  const create: EnvVariable[] = []
  const update: { origin: T; target: EnvVariable }[] = []

  for (const targetEnv of target) {
    const originEnv = origin.find((env) => env.key === targetEnv.key)

    if (!originEnv) {
      create.push(targetEnv)
    } else if (targetEnv.value !== originEnv.value) {
      update.push({ origin: originEnv, target: targetEnv })
    }
  }

  return { create, update }
}

export { parseEnvFile, filterTarget, diffEnvVars }

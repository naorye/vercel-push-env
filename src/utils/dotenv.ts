import fs from 'node:fs'

import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

type EnvVars = Record<string, string>

function parseEnvFile(envFilePath: string): EnvVars {
  const content = fs.readFileSync(envFilePath, 'utf8')

  const envVars = dotenv.parse(content)

  if (Object.keys(envVars).length === 0) {
    throw new Error(`No environment variables found in '${envFilePath}'.`)
  }

  try {
    const parsedEnvVars = dotenvExpand.expand({ ignoreProcessEnv: true, parsed: envVars })

    if (!parsedEnvVars.parsed || parsedEnvVars.error) {
      throw new Error('Unable to expand environment variables.')
    }

    return parsedEnvVars.parsed
  } catch (error) {
    throw new Error(`Unable to parse and expand environment variables in '${envFilePath}'.`, {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

export { parseEnvFile }
export type { EnvVars }

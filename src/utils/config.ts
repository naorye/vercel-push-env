import assert from 'node:assert'
import fs from 'node:fs'

import { Option, program } from 'commander'

program
  .addOption(new Option('--projectId <projectId>', 'the name of your Vercel project').makeOptionMandatory(true))
  .addOption(new Option('--teamId <teamId>', 'the unique id of your Vercel team'))
  .addOption(new Option('--token <token>', 'the access token for your Vercel account').makeOptionMandatory(true))
  .addOption(
    new Option('--targets <targets>', 'the environments to target the variables, separated by comma')
      .makeOptionMandatory(true)
      .choices(['production', 'development', 'preview'])
      .argParser((value) => (value ? value.split(',') : []))
  )
  .addOption(
    new Option('--varType <varType>', 'the type of the variables')
      .makeOptionMandatory(true)
      .choices(['system', 'encrypted', 'plain', 'secret'])
      .default('encrypted')
  )
  .addOption(new Option('--envFile <envFile>', 'the path to your env file').makeOptionMandatory(true))
  .addOption(
    new Option('--apiRoot <apiRoot>', 'vercel api root').makeOptionMandatory(true).default('https://api.vercel.com')
  )

program.parse()

type VercelEnvTarget = 'development' | 'preview' | 'production'

interface Config {
  apiRoot: string
  projectId: string
  teamId?: string
  token: string
  targets: VercelEnvTarget[]
  varType: 'system' | 'encrypted' | 'plain' | 'secret'
  envFile: string
}

const vercelEnvTargets: Set<VercelEnvTarget> = new Set(['development', 'preview', 'production'])

function getConfig() {
  const config = program.opts<Config>()

  for (const target of config.targets) {
    assert(vercelEnvTargets.has(target as VercelEnvTarget), `Unknown environment '${target}' specified.`)
  }

  assert(fs.existsSync(config.envFile), `No file found at '${config.envFile}'.`)

  return config
}

export { getConfig }
export type { Config, VercelEnvTarget }

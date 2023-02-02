type EnvTarget = 'development' | 'preview' | 'production'

interface Config {
  apiRoot: string
  projectId: string
  teamId?: string
  token: string
  targets: EnvTarget[]
  varType: 'system' | 'encrypted' | 'plain' | 'secret'
  envFile: string
}

interface EnvVariable {
  key: string
  value: string
  targets: EnvTarget[]
}

interface VercelEnvVariable extends EnvVariable {
  id: string
}

export type { EnvTarget, Config, EnvVariable, VercelEnvVariable }

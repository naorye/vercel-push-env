import axios from 'axios'

import type { Config, EnvTarget, EnvVariable, VercelEnvVariable } from './types'

interface VercelResponse {
  envs: { id: string; key: string; value: string; target: EnvTarget[] }[]
}

async function fetchVercelEnv(config: Config) {
  const { apiRoot, projectId, teamId, token } = config

  const url = `${apiRoot}/v8/projects/${projectId}/env`
  const response = await axios.get<VercelResponse>(url, {
    params: { teamId, decrypt: true },
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data.envs.map<VercelEnvVariable>((env) => ({
    id: env.id,
    key: env.key,
    value: env.value,
    targets: env.target,
  }))
}

async function createVercelEnvVars(envVars: EnvVariable[], config: Config) {
  const { apiRoot, projectId, teamId, token, varType } = config

  if (envVars.length === 0) {
    return
  }

  let url = `${apiRoot}/v10/projects/${projectId}/env`
  if (teamId) {
    url = `${url}?teamId=${teamId}`
  }

  const payload = envVars.map((envVar) => ({
    key: envVar.key,
    target: envVar.targets,
    type: varType,
    value: envVar.value,
  }))

  await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } })
}

function updateVercelEnvVars(update: { origin: VercelEnvVariable; target: EnvVariable }[], config: Config) {
  const { apiRoot, projectId, teamId, token, varType } = config

  if (update.length === 0) {
    return
  }

  const envVarsToUpdate: VercelEnvVariable[] = update.map(({ origin, target }) => ({
    id: origin.id,
    ...target,
  }))

  // eslint-disable-next-line unicorn/no-array-reduce
  return envVarsToUpdate.reduce<Promise<void>>((lastPromise, envVar) => {
    const { id, key, value, targets } = envVar
    return lastPromise.then(async () => {
      let url = `${apiRoot}/v9/projects/${projectId}/env/${id}`
      if (teamId) {
        url = `${url}?teamId=${teamId}`
      }

      await axios.patch(
        url,
        { key, value, type: varType, target: targets },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    })
  }, Promise.resolve())
}

// const patchVercelVars = async (vars) => {
//   const responses = []
//   const newVars = []
//   for (let i = 0; i < vars.length; i++) {
//     const { id, key, value, type, target, ...rest } = vars[i]
//     if (rest.new) {
//       console.log('New variable identified:', vars[i])
//       console.log('Saving it for later...')
//       newVars.push(vars[i])
//     } else {
//       console.log('Updating environment variable with key:', key)
//       const { data } = await axios
//         .patch(`${api}/v9/projects/${project}/env/${id}?teamId=${teamId}`, { key, value, type, target }, { headers })
//         .catch((err) => {
//           console.log(err.response.data)
//           throw err
//         })

//       responses.push(data)
//     }
//   }

//   return {
//     responses,
//     newVars,
//   }
// }

// module.exports = {
//   getVarsFromVercel,
//   patchVercelVars,
//   pushToVercel,
// }

export { fetchVercelEnv, createVercelEnvVars, updateVercelEnvVars }

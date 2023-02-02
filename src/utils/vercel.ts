import axios from 'axios'

import type { Config, VercelEnvTarget } from './config'

interface VercelEnv {
  key: string
  value: string
  target: VercelEnvTarget[]
}

async function fetchVercelEnv(config: Config) {
  const { apiRoot, projectId, teamId, token } = config

  const url = `${apiRoot}/v8/projects/${projectId}/env`
  const response = await axios.get<{
    envs: VercelEnv[]
  }>(url, {
    params: { teamId, decrypt: true },
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data.envs
}

function filterTarget(envs: VercelEnv[], targets: VercelEnvTarget[]) {
  const targetsKey = targets.sort().join(',')

  const filtered = envs.filter((env) => env.target.sort().join(',').includes(targetsKey))

  return filtered
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

// const pushToVercel = async (vars) => {
//   console.log('Adding new vars...')
//   return axios
//     .post(`${api}/v9/projects/${project}/env/?teamId=${teamId}`, vars, { headers })
//     .then((response) => response.data)
// }

// module.exports = {
//   getVarsFromVercel,
//   patchVercelVars,
//   pushToVercel,
// }

export { fetchVercelEnv, filterTarget }

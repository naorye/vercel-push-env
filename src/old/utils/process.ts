import { exec as execute } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execute)

interface ExecError extends Error {
  stderr: string
  stdout: string
}

function isExecError(error: unknown): error is ExecError {
  return error instanceof Error && typeof (error as ExecError).stderr === 'string'
}

export { exec, isExecError }

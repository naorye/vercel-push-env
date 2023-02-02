import readline from 'node:readline'

import Table from 'cli-table3'
import * as kolorist from 'kolorist'
import { createSpinner } from 'nanospinner'

function text(builder: (colors: typeof kolorist) => string) {
  console.log(builder(kolorist))
}

function table(builder: (colors: typeof kolorist) => [headers: string[], values: string[][]]) {
  const [headers, values] = builder(kolorist)

  const table = new Table({
    head: headers,
    style: { head: [] },
  })

  table.push(...values)

  console.log(table.toString())
}

function redact(value: string) {
  if (value.length < 5) {
    return '*'.repeat(value.length)
  }

  return value[0] + '*'.repeat(value.length - 2) + value[value.length - 1]
}

function spin(message: string) {
  return createSpinner(message, { color: 'cyan' }).start()
}

function confirm(question: string, defaultYes = true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise<void>((resolve, reject) => {
    const answers = getConfirmAnswers(defaultYes)

    rl.question(`${question} (${answers[0]}/${answers[1]}) `, (answer) => {
      rl.close()

      const sanitizedAnswer = answer.trim().toLowerCase()

      if ((sanitizedAnswer === '' && defaultYes) || sanitizedAnswer === 'y' || sanitizedAnswer === 'yes') {
        return resolve()
      }

      return reject(new Error('User aborted.'))
    })
  })
}

function getConfirmAnswers(defaultYes = true): [string, string] {
  return [defaultYes ? 'Y' : 'y', !defaultYes ? 'N' : 'n']
}

export { text, table, redact, spin, confirm }

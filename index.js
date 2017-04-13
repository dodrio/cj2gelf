'use strict'

const readline = require('readline')
const { spawn } = require('child_process')
const gelf = require('gelf-pro')
const isJSON = require('is-json')

const containerProps = [
  'CONTAINER_TAG',
  'CONTAINER_ID',
  'CONTAINER_ID_FULL',
  'CONTAINER_NAME'
]

module.exports = executor

function executor (gelfHost) {
  const journal = spawn('journalctl', ['-o', 'json', '-f'])

  gelf.setConfig({
    host: gelfHost
  })

  const rl = readline.createInterface({
    input: journal.stdout,
    terminal: false
  })

  rl.on('line', line => {
    const json = JSON.parse(line)
    if (json.CONTAINER_NAME && isJSON(json.MESSAGE)) {
      const gelfMsg = translate(json)
      gelf.message(gelfMsg)
    }
  })
}

function translate (json) {
  const rawMsg = json.MESSAGE
  let gelfMsg

  const _json = JSON.parse(rawMsg)
  for (const prop of containerProps) {
    const key = prop.toLowerCase()
    const value = json[prop]

    _json[key] = value
  }

  gelfMsg = JSON.stringify(_json)

  return gelfMsg
}

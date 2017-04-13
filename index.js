'use strict'

const readline = require('readline')
const { spawn } = require('child_process')
const isJSON = require('is-json')
const gelf = require('gelf-pro')

module.exports = executor

function executor (gelfHost) {
  const journal = spawn('journalctl', ['-o', 'json', '-f'])

  gelf.setConfig({
    adapterName: 'udp',
    adapterOptions: {
      host: gelfHost,
      port: 12201
    }
  })

  const rl = readline.createInterface({
    input: journal.stdout,
    terminal: false
  })

  rl.on('line', line => {
    const json = JSON.parse(line)
    if (json.CONTAINER_NAME && isJSON(json.MESSAGE)) {
      let {
        CONTAINER_NAME,
        CONTAINER_TAG,
        CONTAINER_ID,
        CONTAINER_ID_FULL,
        MESSAGE
      } = json

      gelf.info(MESSAGE, {
        container_name: CONTAINER_NAME,
        container_tag: CONTAINER_TAG,
        container_id: CONTAINER_ID,
        container_id_full: CONTAINER_ID_FULL
      })
    }
  })
}

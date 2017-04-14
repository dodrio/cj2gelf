#!/usr/bin/env node

const yargs = require('yargs')
const cj2gelf = require('../index')
const dgram = require('dgram')

const argv = yargs
      .options({
        'gelfhost': {
          describe: 'GELF server host',
          demandOption: true,
          type: 'string'
        },
        'gelfport': {
          describe: 'GELF server port',
          default: 12201,
          type: 'number'
        }
      })
      .version()
      .argv

const {
  gelfhost,
  gelfport
} = argv

const udp4Client = dgram.createSocket('udp4')
udp4Client.send('', gelfport, gelfhost, function (err) {
  if (err) {
    console.error(`Error: invalid GELF server address - ${gelfhost}:${gelfport}`)
    process.exit(1)
  } else {
    cj2gelf(gelfhost, gelfport)
  }
})

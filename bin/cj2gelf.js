#!/usr/bin/env node

const yargs = require('yargs')
const cj2gelf = require('../index')

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
      }).argv

const {
  gelfhost,
  gelfport
} = argv

cj2gelf(gelfhost, gelfport)

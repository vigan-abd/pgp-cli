#!/usr/bin/env node

'use strict'

const fs = require('fs').promises
const { PGPUtil } = require('..')
const pkg = require('../package.json')
const yargs = require('yargs')
  .command(
    'encrypt',
    'encrypts the file with given public key',
    (y) => y.option('key', { type: 'string', alias: 'k', desc: 'path to public key', demandOption: true })
      .option('file', { type: 'string', alias: 'f', desc: 'file that will be encrypted', demandOption: true })
      .option('output', { type: 'string', alias: 'o', desc: 'optional output file path, if omited stdout will be used' })
  )
  .command(
    'decrypt',
    'decrypts the file with given private key',
    (y) => y.option('key', { type: 'string', alias: 'k', desc: 'path to private key', demandOption: true })
      .option('passphrase', { type: 'string', alias: 'p', desc: 'passphrase for decrypting private key' })
      .option('file', { type: 'string', alias: 'f', desc: 'file that will be decrypted', demandOption: true })
      .option('output', { type: 'string', alias: 'o', desc: 'optional output file path, if omited stdout will be used' })
  )
  .demandCommand()
  .recommendCommands()
  .version(pkg.version)
  .help()

const cmds = ['encrypt', 'decrypt']

const main = async () => {
  try {
    const argv = yargs.argv
    const [cmd] = argv._

    if (!cmds.includes(cmd)) throw new Error('ERR_CMD_NOT_SUPPORTED')

    const input = (await fs.readFile(argv.file)).toString()
    const pgp = new PGPUtil()
    let output = ''

    if (cmd === 'encrypt') {
      await pgp.loadPubKeyFromFile(argv.key)
      output = await pgp.encrypt(input)
    }

    if (cmd === 'decrypt') {
      await pgp.loadPrivKeyFromFile(argv.key, argv.passphrase)
      output = await pgp.decrypt(input)
    }

    if (argv.output) {
      await fs.writeFile(argv.output, output, { flag: 'w' })
      console.log('output written to ' + argv.output)
      return
    }

    console.log(output)
  } catch (err) {
    console.error(err)
  }
}

main()

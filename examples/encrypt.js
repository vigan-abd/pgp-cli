'use strict'

const fs = require('fs')
const path = require('path')
const { PGPUtil } = require('..')

const main = async () => {
  const pgp = new PGPUtil()
  await pgp.loadPubKeyFromFile(path.join(__dirname, '..', 'test', 'data', 'pubkey.asc'))

  const msg = 'hello world!!!'
  const encrypted = await pgp.encrypt(msg)

  const outputPath = path.join(process.cwd(), 'encrypted.asc')
  fs.writeFileSync(outputPath, encrypted)
  console.log('--- encrypted content')
  console.log(encrypted)
}

main().catch(console.error)

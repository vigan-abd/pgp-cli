'use strict'

const fs = require('fs')
const path = require('path')
const { PGPUtil } = require('..')

const main = async () => {
  const pgp = new PGPUtil()
  await pgp.loadPrivKeyFromFile(path.join(__dirname, '..', 'test', 'data', 'privkey.asc'), '123456')

  const msg = fs.readFileSync(path.join(__dirname, '..', 'test', 'data', 'encrypted.asc'))
  const decrypted = await pgp.decrypt(msg)

  const outputPath = path.join(process.cwd(), 'decrypted.txt')
  fs.writeFileSync(outputPath, decrypted)
  console.log('--- decrypted content')
  console.log(decrypted)
}

main().catch(console.error)

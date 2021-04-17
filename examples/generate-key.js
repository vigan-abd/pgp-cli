'use strict'

const fs = require('fs')
const path = require('path')
const { PGPUtil, PGP_KEY_TYPES } = require('..')

const main = async () => {
  const pgp = new PGPUtil()
  const keys = await pgp.generateKeyPair({
    userIds: [{ name: 'test', email: 'test@mail.com' }],
    type: PGP_KEY_TYPES.KEY_TYPE_RSA,
    rsaBits: 2048,
    passphrase: '123456',
    keyExpirationTime: new Date('2077-01-01').getTime()
  })

  const privPath = path.join(process.cwd(), 'privkey.asc')
  const pubPath = path.join(process.cwd(), 'pubkey.asc')
  const revokeCertPath = path.join(process.cwd(), 'revoke-cert.asc')

  fs.writeFileSync(privPath, keys.privkey)
  fs.writeFileSync(pubPath, keys.pubkey)
  fs.writeFileSync(revokeCertPath, keys.revokeCert)
  console.log(privPath)
  console.log(keys.privkey)
  console.log(pubPath)
  console.log(keys.pubkey)
  console.log(revokeCertPath)
  console.log(keys.revokeCert)
}

main().catch(console.error)

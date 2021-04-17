'use strict'

const { PGPUtil, PGP_KEY_TYPES } = require('..')

const main = async () => {
  const pgp = new PGPUtil()
  await pgp.generateKeyPair({
    userIds: [{ name: 'test', email: 'test@mail.com' }],
    type: PGP_KEY_TYPES.KEY_TYPE_RSA,
    rsaBits: 2048,
    passphrase: '123456',
    keyExpirationTime: new Date('2077-01-01').getTime()
  })

  const keys = await pgp.exportKeyPair('123456')
  console.log('--- generated keys')
  console.log(keys.pubkey)
  console.log(keys.privkey)

  const msg = 'hello world!!!'

  const encrypted = await pgp.encrypt(msg)
  console.log('--- encrypted content')
  console.log(encrypted)

  const decrypted = await pgp.decrypt(encrypted)
  console.log('--- decrypted content')
  console.log(decrypted)
}

main().catch(console.error)

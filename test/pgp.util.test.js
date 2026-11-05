'use strict'

const fs = require('fs')
const path = require('path')
const openpgp = require('openpgp')
const test = require('brittle')
const { PGPUtil, ELLIPTIC_CURVE_TYPES, PGP_KEY_TYPES } = require('..')

const PUB_KEY_PATH = path.join(__dirname, 'data', 'pubkey.asc')
const PRIV_KEY_PATH = path.join(__dirname, 'data', 'privkey.asc')
const PRIV_KEY_DECRYPTED_PATH = path.join(__dirname, 'data', 'privkey-decrypted.asc')
const PUB_KEY = fs.readFileSync(PUB_KEY_PATH).toString()
const PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH).toString()
const PRIV_KEY_PASSPHRASE = '123456'
const PRIV_KEY_DECRYPTED = fs.readFileSync(PRIV_KEY_DECRYPTED_PATH).toString()
const ENCRYPTED_TEXT = fs.readFileSync(path.join(__dirname, 'data', 'encrypted.asc')).toString()
const PLAINTEXT = fs.readFileSync(path.join(__dirname, 'data', 'decrypted.txt')).toString()

test('PGPUtil - loadPubKey - it should load key from string content', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPubKey(PUB_KEY)
  t.is(key, pgp.pubkey)
  t.ok(key instanceof openpgp.PublicKey)
})

test('PGPUtil - loadPubKeyFromFile - it should load key from file', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPubKeyFromFile(PUB_KEY_PATH)
  t.is(key, pgp.pubkey)
  t.ok(key instanceof openpgp.PublicKey)
})

test('PGPUtil - loadPrivKey - it should load key from string content', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)
  t.is(key, pgp.privkey)
  t.ok(key instanceof openpgp.PrivateKey)
  t.is(key.isDecrypted(), true)
})

test('PGPUtil - loadPrivKey - it should not decrypt key when passphrase is missing', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPrivKey(PRIV_KEY)
  t.is(key, pgp.privkey)
  t.ok(key instanceof openpgp.PrivateKey)
  t.is(key.isDecrypted(), false)
})

test('PGPUtil - loadPrivKey - it should detect decrypted private keys', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPrivKey(PRIV_KEY_DECRYPTED)
  t.is(key, pgp.privkey)
  t.ok(key instanceof openpgp.PrivateKey)
  t.is(key.isDecrypted(), true)
})

test('PGPUtil - loadPrivKeyFromFile - it should load key from file', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPrivKeyFromFile(PRIV_KEY_PATH, PRIV_KEY_PASSPHRASE)
  t.is(key, pgp.privkey)
  t.ok(key instanceof openpgp.PrivateKey)
  t.is(key.isDecrypted(), true)
})

test('PGPUtil - loadPrivKeyFromFile - it should not decrypt key when passphrase is missing', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPrivKeyFromFile(PRIV_KEY_PATH)
  t.is(key, pgp.privkey)
  t.ok(key instanceof openpgp.PrivateKey)
  t.is(key.isDecrypted(), false)
})

test('PGPUtil - loadPrivKeyFromFile - it should detect decrypted private keys', async (t) => {
  const pgp = new PGPUtil()
  const key = await pgp.loadPrivKeyFromFile(PRIV_KEY_DECRYPTED_PATH)
  t.is(key, pgp.privkey)
  t.ok(key instanceof openpgp.PrivateKey)
  t.is(key.isDecrypted(), true)
})

test('PGPUtil - generateKeyPair - it should generate key pair and return them as string format', async (t) => {
  const pgp = new PGPUtil()
  const res = await pgp.generateKeyPair({
    type: PGP_KEY_TYPES.KEY_TYPE_ELLIPTIC_CURVE,
    curve: ELLIPTIC_CURVE_TYPES.CURVE25519,
    userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }],
    passphrase: PRIV_KEY_PASSPHRASE
  })

  t.is(typeof res.pubkey, 'string')
  t.ok(res.pubkey.startsWith(PUB_KEY.substring(0, 30)))
  t.ok(pgp.pubkey instanceof openpgp.PublicKey)

  t.is(typeof res.privkey, 'string')
  t.ok(res.privkey.startsWith(PRIV_KEY.substring(0, 30)))
  t.ok(pgp.privkey instanceof openpgp.PrivateKey)
  t.is(pgp.privkey.isDecrypted(), true)

  t.is(typeof res.revokeCert, 'string')
  t.ok(res.revokeCert.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----'))
})

test('PGPUtil - exportKeyPair - it should export keys as strings', async (t) => {
  const pgp = new PGPUtil()
  await pgp.loadPubKey(PUB_KEY)
  await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)

  const res = await pgp.exportKeyPair(PRIV_KEY_PASSPHRASE)
  t.is(typeof res.pubkey, 'string')
  t.ok(res.pubkey.startsWith(PUB_KEY.substring(0, 30)))
  t.is(typeof res.privkey, 'string')
  t.ok(res.privkey.startsWith(PRIV_KEY.substring(0, 30)))
})

test('PGPUtil - exportKeyPair - it should skip missing keys', async (t) => {
  let pgp = new PGPUtil()
  await pgp.loadPubKey(PUB_KEY)

  let res = await pgp.exportKeyPair(PRIV_KEY_PASSPHRASE)
  t.is(typeof res.pubkey, 'string')
  t.ok(res.pubkey.startsWith(PUB_KEY.substring(0, 30)))
  t.is(res.privkey, null)

  pgp = new PGPUtil()
  await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)

  res = await pgp.exportKeyPair(PRIV_KEY_PASSPHRASE)
  t.is(res.pubkey, null)
  t.is(typeof res.privkey, 'string')
  t.ok(res.privkey.startsWith(PRIV_KEY.substring(0, 30)))
})

test('PGPUtil - exportKeyPair - it should export also non encrypted keys', async (t) => {
  const pgp = new PGPUtil()
  await pgp.loadPubKey(PUB_KEY)
  await pgp.loadPrivKey(PRIV_KEY_DECRYPTED)

  const res = await pgp.exportKeyPair()
  t.is(typeof res.pubkey, 'string')
  t.ok(res.pubkey.startsWith(PUB_KEY.substring(0, 30)))
  t.is(typeof res.privkey, 'string')
  t.ok(res.privkey.startsWith(PRIV_KEY_DECRYPTED.substring(0, 30)))
})

test('PGPUtil - encrypt - it should encrypt the content as expected', async (t) => {
  const pgp = new PGPUtil()
  await pgp.loadPubKey(PUB_KEY)
  const msg = await pgp.encrypt(PLAINTEXT)
  t.is(typeof msg, 'string')
  t.ok(msg.startsWith(ENCRYPTED_TEXT.substring(0, 30)))
})

test('PGPUtil - encrypt - it should encrypt the content as expected with default key', async (t) => {
  const pubkey = await new PGPUtil().loadPubKey(PUB_KEY)
  const pgp = new PGPUtil({ pubkey })
  const msg = await pgp.encrypt(PLAINTEXT)
  t.is(typeof msg, 'string')
  t.ok(msg.startsWith(ENCRYPTED_TEXT.substring(0, 30)))
})

test('PGPUtil - decrypt - it should encrypt the content as expected', async (t) => {
  const pgp = new PGPUtil()
  await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)
  const msg = await pgp.decrypt(ENCRYPTED_TEXT)
  t.is(typeof msg, 'string')
  t.is(msg, PLAINTEXT)
})

test('PGPUtil - decrypt - it should decrypt the content as expected with default key', async (t) => {
  const privkey = await new PGPUtil().loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)
  const pgp = new PGPUtil({ privkey })
  const msg = await pgp.decrypt(ENCRYPTED_TEXT)
  t.is(typeof msg, 'string')
  t.is(msg, PLAINTEXT)
})

test('PGPUtil - decrypt - it should decrypt the content as expected with previosly decrypted key', async (t) => {
  const pgp = new PGPUtil()
  await pgp.loadPrivKey(PRIV_KEY_DECRYPTED)
  const msg = await pgp.decrypt(ENCRYPTED_TEXT)
  t.is(typeof msg, 'string')
  t.is(msg, PLAINTEXT)
})

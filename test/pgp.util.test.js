'use strict'

/* eslint-env mocha */

const fs = require('fs')
const path = require('path')
const openpgp = require('openpgp')
const { expect } = require('chai')
  .use(require('dirty-chai'))
  .use(require('chai-as-promised'))
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

describe('PGPUtil tests', () => {
  it('loadPubKey - it should load key from string content', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPubKey(PUB_KEY)
    expect(key).to.be.equal(pgp.pubkey)
    expect(key).to.be.instanceOf(openpgp.PublicKey)
  })

  it('loadPubKeyFromFile - it should load key from file', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPubKeyFromFile(PUB_KEY_PATH)
    expect(key).to.be.equal(pgp.pubkey)
    expect(key).to.be.instanceOf(openpgp.PublicKey)
  })

  it('loadPrivKey - it should load key from string content', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)
    expect(key).to.be.equal(pgp.privkey)
    expect(key).to.be.instanceOf(openpgp.PrivateKey)
    expect(key.isDecrypted()).to.be.true()
  })

  it('loadPrivKey - it should not decrypt key when passphrase is missing', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPrivKey(PRIV_KEY)
    expect(key).to.be.equal(pgp.privkey)
    expect(key).to.be.instanceOf(openpgp.PrivateKey)
    expect(key.isDecrypted()).to.be.false()
  })

  it('loadPrivKey - it should detect decrypted private keys', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPrivKey(PRIV_KEY_DECRYPTED)
    expect(key).to.be.equal(pgp.privkey)
    expect(key).to.be.instanceOf(openpgp.PrivateKey)
    expect(key.isDecrypted()).to.be.true()
  })

  it('loadPrivKeyFromFile - it should load key from file', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPrivKeyFromFile(PRIV_KEY_PATH, PRIV_KEY_PASSPHRASE)
    expect(key).to.be.equal(pgp.privkey)
    expect(key).to.be.instanceOf(openpgp.PrivateKey)
    expect(key.isDecrypted()).to.be.true()
  })

  it('loadPrivKeyFromFile - it should not decrypt key when passphrase is missing', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPrivKeyFromFile(PRIV_KEY_PATH)
    expect(key).to.be.equal(pgp.privkey)
    expect(key).to.be.instanceOf(openpgp.PrivateKey)
    expect(key.isDecrypted()).to.be.false()
  })

  it('loadPrivKeyFromFile - it should detect decrypted private keys', async () => {
    const pgp = new PGPUtil()
    const key = await pgp.loadPrivKeyFromFile(PRIV_KEY_DECRYPTED_PATH)
    expect(key).to.be.equal(pgp.privkey)
    expect(key).to.be.instanceOf(openpgp.PrivateKey)
    expect(key.isDecrypted()).to.be.true()
  })

  it('generateKeyPair - it should generate key pair and return them as string format', async () => {
    const pgp = new PGPUtil()
    const res = await pgp.generateKeyPair({
      type: PGP_KEY_TYPES.KEY_TYPE_ELLIPTIC_CURVE,
      curve: ELLIPTIC_CURVE_TYPES.CURVE25519,
      userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }],
      passphrase: PRIV_KEY_PASSPHRASE
    })

    expect(res.pubkey).to.be.a('string')
    expect(res.pubkey.startsWith(PUB_KEY.substring(0, 30))).to.be.true()
    expect(pgp.pubkey).to.be.instanceOf(openpgp.PublicKey)

    expect(res.privkey).to.be.a('string')
    expect(res.privkey.startsWith(PRIV_KEY.substring(0, 30))).to.be.true()
    expect(pgp.privkey).to.be.instanceOf(openpgp.PrivateKey)
    expect(pgp.privkey.isDecrypted()).to.be.true()

    expect(res.revokeCert).to.be.a('string')
    expect(res.revokeCert.startsWith('-----BEGIN PGP PUBLIC KEY BLOCK-----')).to.be.true()
  })

  it('exportKeyPair - it should export keys as strings', async () => {
    const pgp = new PGPUtil()
    await pgp.loadPubKey(PUB_KEY)
    await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)

    const res = await pgp.exportKeyPair(PRIV_KEY_PASSPHRASE)
    expect(res.pubkey).to.be.a('string')
    expect(res.pubkey.startsWith(PUB_KEY.substring(0, 30))).to.be.true()
    expect(res.privkey).to.be.a('string')
    expect(res.privkey.startsWith(PRIV_KEY.substring(0, 30))).to.be.true()
  })

  it('exportKeyPair - it should skip missing keys', async () => {
    let pgp = new PGPUtil()
    await pgp.loadPubKey(PUB_KEY)

    let res = await pgp.exportKeyPair(PRIV_KEY_PASSPHRASE)
    expect(res.pubkey).to.be.a('string')
    expect(res.pubkey.startsWith(PUB_KEY.substring(0, 30))).to.be.true()
    expect(res.privkey).to.be.null()

    pgp = new PGPUtil()
    await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)

    res = await pgp.exportKeyPair(PRIV_KEY_PASSPHRASE)
    expect(res.pubkey).to.be.null()
    expect(res.privkey).to.be.a('string')
    expect(res.privkey.startsWith(PRIV_KEY.substring(0, 30))).to.be.true()
  })

  it('exportKeyPair - it should export also non encrypted keys', async () => {
    const pgp = new PGPUtil()
    await pgp.loadPubKey(PUB_KEY)
    await pgp.loadPrivKey(PRIV_KEY_DECRYPTED)

    const res = await pgp.exportKeyPair()
    expect(res.pubkey).to.be.a('string')
    expect(res.pubkey.startsWith(PUB_KEY.substring(0, 30))).to.be.true()
    expect(res.privkey).to.be.a('string')
    expect(res.privkey.startsWith(PRIV_KEY_DECRYPTED.substring(0, 30))).to.be.true()
  })

  it('encrypt - it should encrypt the content as expected', async () => {
    const pgp = new PGPUtil()
    await pgp.loadPubKey(PUB_KEY)
    const msg = await pgp.encrypt(PLAINTEXT)
    expect(msg).to.be.a('string')
    expect(msg.startsWith(ENCRYPTED_TEXT.substring(0, 30))).to.be.true()
  })

  it('encrypt - it should encrypt the content as expected with default key', async () => {
    const pubkey = await new PGPUtil().loadPubKey(PUB_KEY)
    const pgp = new PGPUtil({ pubkey })
    const msg = await pgp.encrypt(PLAINTEXT)
    expect(msg).to.be.a('string')
    expect(msg.startsWith(ENCRYPTED_TEXT.substring(0, 30))).to.be.true()
  })

  it('decrypt - it should encrypt the content as expected', async () => {
    const pgp = new PGPUtil()
    await pgp.loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)
    const msg = await pgp.decrypt(ENCRYPTED_TEXT)
    expect(msg).to.be.a('string')
    expect(msg).to.be.equal(PLAINTEXT)
  })

  it('decrypt - it should decrypt the content as expected with default key', async () => {
    const privkey = await new PGPUtil().loadPrivKey(PRIV_KEY, PRIV_KEY_PASSPHRASE)
    const pgp = new PGPUtil({ privkey })
    const msg = await pgp.decrypt(ENCRYPTED_TEXT)
    expect(msg).to.be.a('string')
    expect(msg).to.be.equal(PLAINTEXT)
  })

  it('decrypt - it should decrypt the content as expected with previosly decrypted key', async () => {
    const pgp = new PGPUtil()
    await pgp.loadPrivKey(PRIV_KEY_DECRYPTED)
    const msg = await pgp.decrypt(ENCRYPTED_TEXT)
    expect(msg).to.be.a('string')
    expect(msg).to.be.equal(PLAINTEXT)
  })
})

'use strict'

const fs = require('fs')
const openpgp = require('openpgp')

/**
 * PGP utility class that is useful for performing basic operations
 */
class PGPUtil {
  /**
   * @param {object} [opts] - Default keys used for encryption/decryption
   * @param {openpgp.Key} [opts.pubkey] - Public key
   * @param {openpgp.Key} [opts.privkey] - Private key, should be decrypted for proper usage!
   */
  constructor (opts = {}) {
    this.pubkey = opts.pubkey || null
    this.privkey = opts.privkey || null
  }

  /**
   * @param {string|Buffer} content - PGP public key raw content
   * @returns {Promise<openpgp.Key>}
   */
  async loadPubKey (content) {
    this.pubkey = await openpgp.readKey({ armoredKey: content })
    return this.pubkey
  }

  /**
   * @param {fs.PathLike} fpath - PGP public key file path
   * @returns {Promise<openpgp.Key>}
   */
  async loadPubKeyFromFile (fpath) {
    const content = await fs.promises.readFile(fpath)
    return this.loadPubKey(content)
  }

  /**
   * @param {string|Buffer} content - PGP private key raw content
   * @param {string|string[]} [passphrase] - Passphrase for decrypting key, if omited the key won't be decrypted, skip it when key is already decrypted
   * @returns {Promise<openpgp.Key>}
   */
  async loadPrivKey (content, passphrase = null) {
    this.privkey = await openpgp.readKey({ armoredKey: content })
    if (passphrase) await this.privkey.decrypt(passphrase)
    return this.privkey
  }

  /**
   * @param {fs.PathLike} fpath - PGP private key file path
   * @param {string|string[]} [passphrase] - Passphrase for decrypting key, if omited the key won't be decrypted, skip it when key is already decrypted
   * @returns {Promise<openpgp.Key>}
   */
  async loadPrivKeyFromFile (fpath, passphrase = null) {
    const content = await fs.promises.readFile(fpath)
    return this.loadPrivKey(content, passphrase)
  }

  /**
   * @param {openpgp.KeyOptions} opts - Opts related to generating key pair, e.g. algorithm...
   * @returns {Promise<{ pubkey: string, privkey: string, revokeCert: string }>}
   */
  async generateKeyPair (opts) {
    const { publicKeyArmored, privateKeyArmored, revocationCertificate } = await openpgp.generateKey(opts)
    this.pubkey = await this.loadPubKey(publicKeyArmored)
    this.privkey = await this.loadPrivKey(privateKeyArmored, opts.passphrase)

    return {
      pubkey: publicKeyArmored,
      privkey: privateKeyArmored,
      revokeCert: revocationCertificate
    }
  }

  /**
   * @param {string|string[]} [passphrase] - Passphrase used for encrypting private key before exporting it, if omited decrypted key will be exported
   * @returns {Promise<{ pubkey: string?, privkey: string? }>}
   */
  async exportKeyPair (passphrase = null) {
    const pubkey = this.pubkey ? this.pubkey.armor() : null

    let privkey = null
    if (this.privkey) {
      privkey = passphrase
        ? (await openpgp.encryptKey({ privateKey: this.privkey, passphrase })).armor()
        : this.privkey.armor()
    }

    return { pubkey, privkey }
  }

  /**
   * @param {string} message - Plain text that will be encrypted
   * @returns {Promise<string>}
   */
  async encrypt (message) {
    const msg = await openpgp.encrypt({
      message: openpgp.Message.fromText(message),
      publicKeys: this.pubkey
    })

    return msg.toString()
  }

  /**
   * @param {string} message - Encrypted raw message
   * @returns {Promise<string>}
   */
  async decrypt (message) {
    const msg = await openpgp.readMessage({ armoredMessage: message })
    const decrypted = await openpgp.decrypt({
      message: msg,
      privateKeys: this.privkey
    })

    return decrypted.data.toString()
  }
}

module.exports = PGPUtil

'use strict'

const PGP_KEY_TYPES = {
  KEY_TYPE_RSA: 'rsa',
  KEY_TYPE_ELLIPTIC_CURVE: 'ecc'
}

const ELLIPTIC_CURVE_TYPES = {
  ED25519: 'ed25519',
  CURVE25519: 'curve25519',
  P256: 'p256',
  P384: 'p384',
  P521: 'p521',
  SECP256k1: 'secp256k1',
  BRAINPOOLP256r1: 'brainpoolP256r1',
  BRAINPOOLP384r1: 'brainpoolP384r1',
  BRAINPOOLP512r1: 'brainpoolP512r1'
}

Object.freeze(PGP_KEY_TYPES)
Object.freeze(ELLIPTIC_CURVE_TYPES)

module.exports = {
  PGP_KEY_TYPES,
  ELLIPTIC_CURVE_TYPES
}

# pgp-cli

[![Build Status](https://travis-ci.com/vigan-abd/pgp-cli.svg?branch=main)](https://travis-ci.com/vigan-abd/pgp-cli)
![npm](https://img.shields.io/npm/v/pgp-cli)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/vigan-abd/pgp-cli.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/vigan-abd/pgp-cli/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/vigan-abd/pgp-cli.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/vigan-abd/pgp-cli/context:javascript)

**`pgp-cli`** is a simple cross platform cli tool for encrypting and decrypting
openpgp messages.

Currently supported features are:
- encrypt message
- decrypt message
- generate key pair (not available through cli)


## Installing

For usage as library run:
```console
npm install pgp-cli --save
```

For usage as cli tool run:
```console
npm install pgp-cli --global
```


## Usage

CLI usage:
```console
pgp-cli.js <command>

Commands:
  pgp-cli.js encrypt  encrypts the file with given public key
  pgp-cli.js decrypt  decrypts the file with given private key

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]


pgp-cli.js encrypt
Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -k, --key      path to public key                          [string] [required]
  -f, --file     file that will be encrypted                 [string] [required]
  -o, --output   optional output file path, if omited stdout will be used
                                                                        [string]

pgp-cli.js decrypt
Options:
      --version     Show version number                                [boolean]
      --help        Show help                                          [boolean]
  -k, --key         path to private key                      [string] [required]
  -p, --passphrase  passphrase for decrypting private key               [string]
  -f, --file        file that will be decrypted              [string] [required]
  -o, --output      optional output file path, if omited stdout will be used
                                                                        [string]
```

Code usage:
```javascript
const { PGPUtil, PGP_KEY_TYPES } = require('pgp-cli')

const pgp = new PGPUtil()
await pgp.generateKeyPair({
  userIDs: [{ name: 'test', email: 'test@mail.com' }],
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

```

Additional detailed examples can be found in [examples folder](./examples).

Also full documentation related classes can be found in [docs/DEFINITIONS.md](./docs/DEFINITIONS.md)


## Testing

```console
npm run test
```


## Authors
- vigan-abd (vigan.abd@gmail.com)

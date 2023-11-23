<a name="PGPUtil"></a>

## PGPUtil
PGP utility class that is useful for performing basic operations

**Kind**: global class  

* [PGPUtil](#PGPUtil)
    * [new PGPUtil([opts])](#new_PGPUtil_new)
    * [.loadPubKey(content)](#PGPUtil+loadPubKey) ⇒ <code>Promise.&lt;openpgp.PublicKey&gt;</code>
    * [.loadPubKeyFromFile(fpath)](#PGPUtil+loadPubKeyFromFile) ⇒ <code>Promise.&lt;openpgp.PublicKey&gt;</code>
    * [.loadPrivKey(content, [passphrase])](#PGPUtil+loadPrivKey) ⇒ <code>Promise.&lt;openpgp.PrivateKey&gt;</code>
    * [.loadPrivKeyFromFile(fpath, [passphrase])](#PGPUtil+loadPrivKeyFromFile) ⇒ <code>Promise.&lt;openpgp.PrivateKey&gt;</code>
    * [.generateKeyPair(opts)](#PGPUtil+generateKeyPair) ⇒ <code>Promise.&lt;{pubkey: string, privkey: string, revokeCert: string}&gt;</code>
    * [.exportKeyPair([passphrase])](#PGPUtil+exportKeyPair) ⇒ <code>Promise.&lt;{pubkey: ?string, privkey: ?string}&gt;</code>
    * [.encrypt(message)](#PGPUtil+encrypt) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.decrypt(message)](#PGPUtil+decrypt) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_PGPUtil_new"></a>

### new PGPUtil([opts])

| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>object</code> | Default keys used for encryption/decryption |
| [opts.pubkey] | <code>openpgp.Key</code> | Public key |
| [opts.privkey] | <code>openpgp.Key</code> | Private key, should be decrypted for proper usage! |

<a name="PGPUtil+loadPubKey"></a>

### pgpUtil.loadPubKey(content) ⇒ <code>Promise.&lt;openpgp.PublicKey&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> \| <code>Buffer</code> | PGP public key raw content |

<a name="PGPUtil+loadPubKeyFromFile"></a>

### pgpUtil.loadPubKeyFromFile(fpath) ⇒ <code>Promise.&lt;openpgp.PublicKey&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Description |
| --- | --- | --- |
| fpath | <code>fs.PathLike</code> | PGP public key file path |

<a name="PGPUtil+loadPrivKey"></a>

### pgpUtil.loadPrivKey(content, [passphrase]) ⇒ <code>Promise.&lt;openpgp.PrivateKey&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| content | <code>string</code> \| <code>Buffer</code> |  | PGP private key raw content |
| [passphrase] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <code>null</code> | Passphrase for decrypting key, if omited the key won't be decrypted, skip it when key is already decrypted |

<a name="PGPUtil+loadPrivKeyFromFile"></a>

### pgpUtil.loadPrivKeyFromFile(fpath, [passphrase]) ⇒ <code>Promise.&lt;openpgp.PrivateKey&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fpath | <code>fs.PathLike</code> |  | PGP private key file path |
| [passphrase] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <code>null</code> | Passphrase for decrypting key, if omited the key won't be decrypted, skip it when key is already decrypted |

<a name="PGPUtil+generateKeyPair"></a>

### pgpUtil.generateKeyPair(opts) ⇒ <code>Promise.&lt;{pubkey: string, privkey: string, revokeCert: string}&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>openpgp.KeyOptions</code> | Opts related to generating key pair, e.g. algorithm... |

<a name="PGPUtil+exportKeyPair"></a>

### pgpUtil.exportKeyPair([passphrase]) ⇒ <code>Promise.&lt;{pubkey: ?string, privkey: ?string}&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [passphrase] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <code>null</code> | Passphrase used for encrypting private key before exporting it, if omited decrypted key will be exported |

<a name="PGPUtil+encrypt"></a>

### pgpUtil.encrypt(message) ⇒ <code>Promise.&lt;string&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Plain text that will be encrypted |

<a name="PGPUtil+decrypt"></a>

### pgpUtil.decrypt(message) ⇒ <code>Promise.&lt;string&gt;</code>
**Kind**: instance method of [<code>PGPUtil</code>](#PGPUtil)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Encrypted raw message |


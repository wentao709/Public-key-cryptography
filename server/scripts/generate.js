const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

console.log('private key: ', toHex(privateKey))

const publicKey = secp.getPublicKey(privateKey);

console.log('public key: ', toHex(publicKey))

async function signMessage(){
    const message = "transfer funds"
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes); 
    const sig = await toHex(secp.sign(hash, privateKey, { recovered: true }));
}

signMessage();



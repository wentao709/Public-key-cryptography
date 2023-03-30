import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, sig, setSig, recoverBit, setRecoverBit }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = await toHex(secp.getPublicKey(privateKey));
    setAddress(address);
    const sig = await signMessage(privateKey);
    setSig(sig[0].toString());
    setRecoverBit(sig[1]);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function signMessage(privateKey){
    const message = "transfer funds";
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes); 
    const sig = await secp.sign(hash, privateKey, { recovered: true });
    return sig;
}

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Put your private key here" value={privateKey} onChange={onChange}></input>
      </label>
      <div>address: {address}</div>
      <div>Signature: {sig}</div>
      <div>Recover bit: {recoverBit}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

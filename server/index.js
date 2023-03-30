const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0433d85cb82dcf51b121ef783dd32ca7fb2a3cc682e0c1c0b0c365e4c3a4367b836769fb3d813af38d27952f75989eb269f3309a59f69f5065ef6f62aab7dd687b": 100, // dan's wallet
  "042300f70dd5454c331e9650c60858af9ad51b8e0547cb4f022a4ba69e14c248189869bce42d2b2cb75247fb30e2b3de825591a25ba9a7052da9255d074e72da9a": 50, // al's wallet
  "0460a821655ed93c70cd76b0308a10b555bc1ae23677f9fbf3073316433a358044427987e35dbffc33ff25c6227be8069a2844cda43442eb3958457637ebd9b9f3": 75, // mike's wallet
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application 
  // recover the public address from the signature

  // don't let the client to set the sender. main issue: anyone can send anyone's fund
  // only Dan can send fund from his address. for now, me(dan) can transfer money from al's wallet to mine. 
  const { recipient, amount, sender, sig, recoverBit, publicKey } = req.body;
  console.log("123");
  setInitialBalance(sender);
  setInitialBalance(recipient);
  const message = "transfer funds"
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes); 
  const publicKeys = toHex(secp.recoverPublicKey(hash, Uint8Array.from(sig.split(",")), recoverBit));

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }else if(publicKeys !== publicKey){
    res.status(400).send({ message: "invalid private key" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

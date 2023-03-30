import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

async function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [sig, setSig] = useState("");
  const [recoverBit, setRecoverBit] = useState("");
  const data = await fetch("http://localhost:3042/");
  console.log("data is " +  JSON.stringify(data) );
  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        sig={sig}
        setSig={setSig}
        recoverBit={recoverBit}
        setRecoverBit={setRecoverBit}
      />
      <Transfer setBalance={setBalance} address={address} sig={sig} recoverBit={recoverBit}/>
    </div>
  );
}

export default App;

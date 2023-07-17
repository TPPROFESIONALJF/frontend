import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import GreeterArtifact from "./contracts/Greeter.json";
import ContractAddress from "./contracts/ContractAddress.json";

import { useState, useEffect } from 'react';
let contractAddress = ContractAddress.greeterAddress;
declare let window: any;

export default function App() {
  const [message, setMessage] = useState("World");
  const [greeterContract, setGreeterContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider>(new ethers.providers.Web3Provider(window.ethereum));
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  async function updateGreetingState() {
    let greeting = greeterContract?.greet();
    await greeting.then((result: string) => 
      setMessage(result)
    ).catch(function(reason: any) {
      console.log(reason);
   });
  }

  useEffect(() => {
    const initialize = async () => {
      await _intializeEthers();
      updateGreetingState();
    };

    initialize().catch(console.error);;
  }, [provider]);

  useEffect(() => {
    // When signer changes we must reinstantiate our contracts with the new signer 
    // so they get executed with the new one
    if (signer != null) {
      setGreeterContract(new ethers.Contract(
        contractAddress,
        GreeterArtifact.abi,
        signer
      ));
    }
  }, [signer]);

  async function _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    await window.ethereum.enable();
    provider?.on("accountsChanged", accounts => {
      setSigner(accounts[0]);
    });
    // When, we initialize the contract using that provider and the greeter's
    // artifact. You can do this same thing with your contracts.
    
  }

  async function cambiarSaludo() {
    let setGreeting = greeterContract?.setGreeting("Nuevo greeting22");
    await setGreeting?.then(async () => {
      await updateGreetingState();
    });
  }

  function render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React! Changes :D
            <div>{ message }</div>
          </a>
          <button onClick={() => cambiarSaludo()}>Cambiar saludo</button>
        </header>
      </div>
    );
  }
}

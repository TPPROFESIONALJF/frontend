import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import GreeterArtifact from "./contracts/Greeter.json";
import ContractAddress from "./contracts/ContractAddress.json";

import React from 'react';
import { messagePrefix } from '@ethersproject/hash';
let contractAddress = ContractAddress.greeterAddress;
declare let window: any;

interface AppProps {}
interface AppState {
  message: string | null
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      message: null
    };
  }

  async updateGreetingState() {
    let greeting = _contract.greet();
    await greeting.then((result: string) => 
      this.setState({
        message: result
      })
    ).catch(function(reason: any) {
      console.log(reason);
   });
  }

  async componentDidMount() {
    await _intializeEthers();
    this.updateGreetingState();
  }

  async cambiarSaludo() {
    let setGreeting = _contract.setGreeting("Nuevo greeting22");
    await setGreeting.then(async () => {
      await this.updateGreetingState();
    });
  }

  render(){
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
            <div>{this.state.message}</div>
          </a>
          <button onClick={() => this.cambiarSaludo()}>Cambiar saludo</button>
        </header>
      </div>
    );
  }
}

export default App;

let _contract: ethers.Contract;
//_intializeEthers();
var provider;
async function _intializeEthers() {
  // We first initialize ethers by creating a provider using window.ethereum
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await window.ethereum.enable();
  // When, we initialize the contract using that provider and the greeter's
  // artifact. You can do this same thing with your contracts.
  _contract = new ethers.Contract(
    contractAddress,
    GreeterArtifact.abi,
    provider.getSigner(0)
  );
}

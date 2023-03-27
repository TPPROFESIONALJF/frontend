import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import GreeterArtifact from "./contracts/Greeter.json";
import WACCArtifact from "./contracts/WACCCalculator.json";
import ContractAddress from "./contracts/ContractAddress.json";

import React from 'react';
import { messagePrefix } from '@ethersproject/hash';
let contractAddress = ContractAddress.greeterAddress;
let waccContractAddress = ContractAddress.waccCalculatorAddress;
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
    console.log("updating greeting!");
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
    (await _contract.setGreeting("Nuevo greeting22332"))
      .wait()
      .then(async () => {
        await this.updateGreetingState();
      }
    );
  }

  async pruebaDecimal() {
    let big = BigInt(99999 * 1e18);
    let result = await _waccContract.calculate(big);
    console.log(result / 1e18);
    let result2 = await _waccContract.returnFloatValue();
    console.log(result2);
    /*let calculate = _waccContract.calculate(497);
    await calculate.then(async (result: string) => {
      console.log(result);
    });*/
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
          <button onClick={() => this.pruebaDecimal()}>Ejecutar prueba</button>
        </header>
      </div>
    );
  }
}

export default App;

let _contract: ethers.Contract;
let _waccContract: ethers.Contract;
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
  _waccContract = new ethers.Contract(
    waccContractAddress,
    WACCArtifact.abi,
    provider.getSigner(0)
  );
}

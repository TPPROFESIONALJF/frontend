import Head from "next/head";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import { greeterABI } from "@/contracts/Greeter";
import ContractAddresses from "@/contracts/ContractAddresses.json";

import { useState } from "react";
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'

export default function Home() {
  const [newName, setNewName] = useState("");
  
  const { data: name } = useContractRead({
    address: ContractAddresses.greeterAddress as `0x${string}`,
    abi: greeterABI,
    functionName: 'greet',
    watch: true
  });

  const { config } = usePrepareContractWrite({
    address: ContractAddresses.greeterAddress as `0x${string}`,
    abi: greeterABI,
    functionName: 'setGreeting',
    args: [newName]
  });
  const { data, write: setGreeting } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  async function handleCambiarSaludo() {
    setGreeting?.()
  }

  return (
    <>
      <Head>
        <title>CryptoFundMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        Hello world!
      </main>
    </>
  );
}

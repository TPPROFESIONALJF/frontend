import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import { greeterABI } from "@/contracts/Greeter";
import ContractAddresses from "@/contracts/ContractAddresses.json";

import { useState } from "react";
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { Button } from "@mui/material";

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
      <header>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="WalletConnect Logo"
              height="32"
              width="203"
            />
          </div>
          <div className={styles.buttons}>
            <div>
              <w3m-network-button />
            </div>
            <div>
              <w3m-button />
            </div>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <h1>Next.js Starter Template</h1>
            {!name && <div>Cargando...</div>}
            {name && <div>Hola {name}!</div>}
            <input placeholder="Franco" onChange={(e) => setNewName(e.target.value)}></input>
            <Button variant="contained" disabled={isLoading} onClick={(e) => handleCambiarSaludo()}>{isLoading ? 'Cambiando saludo...' : 'Cambiar saludo'}</Button>
            <div className={styles.content}>
              <w3m-button />
            </div>
          </div>
          <div className={styles.footer}>
              Check out the full documentation here
          </div>
        </div>
      </main>
    </>
  );
}

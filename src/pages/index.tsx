import Head from "next/head";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import { greeterABI } from "@/contracts/Greeter";
import ContractAddresses from "@/contracts/ContractAddresses.json";

import { useState } from "react";
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
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
      <Box
        sx={{
          height: "100%",
          pt: 8,
          pb: 6,
          paddingX: 6
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Welcome to CryptoFundMe
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Explore interesting projects to invest on or create your own
            project so other investors can fund your idea
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" onClick={() => router.push("/projects") }>Explore projects</Button>
            <Button variant="outlined" onClick={() => router.push("/projects/create") }>Create project</Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}


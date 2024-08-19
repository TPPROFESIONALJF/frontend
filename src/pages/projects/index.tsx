import Projects from "@/components/Projects";
import { dcfCalculatorABI } from "@/contracts/DCFCalculator";
import { setDCFCalculatorValues } from "@/utils/projectsUtils";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { Box, Button } from "@mui/material";
import Head from "next/head";
import { useContractRead } from "wagmi";

export default function ProjectsIndex() {

  return (
    <>
      <Head>
        <title>CryptoFundMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className='mainContainer'>
        <Projects />
      </Box>
    </>
  )
}

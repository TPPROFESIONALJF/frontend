import Projects from "@/components/Projects";
import { Box } from "@mui/material";
import Head from "next/head";

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

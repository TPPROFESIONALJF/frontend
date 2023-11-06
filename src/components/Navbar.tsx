import Head from "next/head";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar className={styles.header}>
              <Image
                src="/logo.png"
                alt="CryptoFundMe Logo"
                width="0"
                height="0"
                sizes="100vw"
                style={{ height: '100%', width: 'auto' }}
              />
              <div className={styles.buttons}>
                <w3m-network-button />
                <w3m-button />
              </div>
            </Toolbar>
          </AppBar>
        </Box>
      </header>
    </>
  )
}

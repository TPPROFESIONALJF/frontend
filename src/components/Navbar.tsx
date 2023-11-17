import Head from "next/head";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { AppBar, Box, Toolbar } from "@mui/material";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar sx={{
            marginX: 8
          }} className={styles.header}>
            <Link href="/">
              <Image
                src="/logo.png"
                alt="CryptoFundMe Logo"
                width="0"
                height="0"
                sizes="100vw"
                style={{ height: '100%', width: 'auto', minHeight: '60px', maxHeight: '75px' }}
              />
            </Link>
            <div className={styles.buttons}>
              <w3m-network-button />
              <w3m-button />
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}

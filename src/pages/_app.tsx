import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
  mainnet,
  sepolia,
  hardhat,
} from "wagmi/chains";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@/utils/createEmotionCache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from '@/styles/theme';
import Navbar from "@/components/Navbar";

const chains = [
  mainnet,
  sepolia,
  hardhat
];

// 1. Get projectID at https://cloud.walletconnect.com

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains, 
  themeVariables: {
    '--w3m-font-family': theme.typography.fontFamily,
    '--w3m-accent': theme.palette.primary.main
  }
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <WagmiConfig config={wagmiConfig}>
              <Navbar />
              <Component {...pageProps} />
            </WagmiConfig>
          </ThemeProvider>
        </CacheProvider>
      ) : null}
    </>
  );
}

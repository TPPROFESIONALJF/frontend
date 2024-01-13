import Head from "next/head";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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


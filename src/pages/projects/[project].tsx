import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Divider, Grid, Stack, Typography, colors } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { fundingManagerABI } from "@/contracts/FundingManager";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import NotFound from './404';
import { getIndustrieById } from "@/utils/projectsUtils";
import Image from 'next/image';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import InvestModal from '@/components/InvestModal';
import { useState } from 'react';

export default function Project() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const projectId = router.query.project;

  if (!projectId) {
    return <NotFound />;
  }
  const { data: project, isError, isLoading } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x$cd{string}`,
    abi: fundingManagerABI,
    functionName: 'getProject',
    args: [BigInt(projectId.toString())],
    watch: true
  });

  if (project === undefined || project.id === BigInt(0)) {
    return <NotFound />;
  }

  function getIndustrieName(): string {
    if (project === undefined) { return "N/A" }
    return getIndustrieById(project!!.id.toString())!!.name;
  }

  function invest(value: number) {
    alert("HI!");
  }

  return (
    <>
      <Head>
        <title>CryptoFundMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container sx={{ pt: 4 }} maxWidth="lg" fixed>
        <InvestModal props={{ open, handleClose, handleInvest: invest }} />
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography
              component="h3"
              variant="h3"
              fontWeight="fontWeightBold"
              align="center"
            >
              {project.name}
            </Typography>
            <Typography
              component="h1"
              variant="subtitle1"
              gutterBottom
              align="center"
            >
              Category: {getIndustrieName()}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item md={6}>
                <Card sx={{
                  width: "100%",
                  backgroundColor: 'background.default'
                }}>
                  <CardMedia component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers">
                  </CardMedia>
                </Card>
              </Grid>
              <Grid item md={6}>
                <Card variant="outlined"
                  sx={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: 'background.default',
                    borderColor: 'primary.main'
                  }}>
                  <CardContent>
                    <Stack direction="column" spacing={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center">
                        <Image
                          src="/images/investors.png"
                          alt="Users Logo"
                          width="0"
                          height="0"
                          sizes="100vw"
                          style={{ height: 'auto', width: '36px' }}
                        />
                        <Typography variant="body1">
                          ZZ Unique contributors
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center">
                        <Image
                          src="/images/token.png"
                          alt="Token logo"
                          width="0"
                          height="0"
                          sizes="100vw"
                          style={{ height: 'auto', width: '36px' }}
                        />
                        <Typography variant="body1">
                          {project.funded.toString()}/{project.goal.toString()} Tokens funded
                        </Typography>
                      </Stack>
                      <LinearProgressWithLabel color="secondary" value={Number(project.funded / project.goal)}></LinearProgressWithLabel>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleOpen}>
                        INVEST NOW
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={12}>
                <Typography
                  component="h1"
                  variant="body1"
                  gutterBottom
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

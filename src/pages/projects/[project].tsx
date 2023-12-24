import { Backdrop, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { waitForTransaction, writeContract } from '@wagmi/core'
import { fundingManagerABI } from "@/contracts/FundingManager";
import { dummyDAIABI } from "@/contracts/DummyDAI";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import NotFound from './404';
import { getIndustrieById } from "@/utils/projectsUtils";
import Image from 'next/image';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import InvestModal from '@/components/InvestModal';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import '@/utils/numberUtils'

export default function Project() {
  const [investAmount, setInvestAmount] = useState(0);
  const debouncedInvestAmount = useDebounce(investAmount, 500);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(BigInt(-1));
  const [isInvesting, setIsInvesting] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const projectIdAsString = router.query.project;
  useEffect(() => {
    if (!router.isReady) return;
    // codes using router.query
    const projectId = projectIdAsString == undefined ? BigInt(-1) : BigInt(projectIdAsString.toString());
    setProjectId(projectId);
  }, [router.isReady]);

  const { data: project } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'getProject',
    args: [projectId],
    watch: true
  });

  const { config: increaseAllowanceConfig } = usePrepareContractWrite({
    address: ContractAddresses.dummyDAIAddress as `0x${string}`,
    abi: dummyDAIABI,
    functionName: 'increaseAllowance',
    args: [
      ContractAddresses.fundingManagerAddress as `0x${string}`,
      BigInt(debouncedInvestAmount.asTokenSmallestUnit())
    ]
  });

  const { config: resetAllowanceConfig } = usePrepareContractWrite({
    address: ContractAddresses.dummyDAIAddress as `0x${string}`,
    abi: dummyDAIABI,
    functionName: 'approve',
    args: [
      ContractAddresses.fundingManagerAddress as `0x${string}`,
      BigInt(0)
    ]
  });

  const { config: investConfig } = usePrepareContractWrite({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'invest',
    args: [
      projectId,
      BigInt(debouncedInvestAmount.asTokenSmallestUnit())
    ]
  });

  if (project !== undefined && project.id === BigInt(0)) {
    return <NotFound />;
  }

  function getIndustrieName(): string {
    if (project === undefined) { return "N/A" }
    return getIndustrieById(project!!.id.toString())!!.name;
  }

  function getProjectProgress(): number {
    return project
      ? Number(project.funded * BigInt(100) / project.goal)
      : 0;
  }

  async function invest() {
    try {
      setIsInvesting(true);
      // First let the user increase the allowance of tokens on our behalf
      const { hash: increaseAllowanceHash } = await writeContract(increaseAllowanceConfig);
      await waitForTransaction({ hash: increaseAllowanceHash });

      // Second ask the user to approve the invest on the project
      const { hash: investHash } = await writeContract(investConfig);
      await waitForTransaction({ hash: investHash });

      //TODO: Show feedback to user
    } catch (e) {
      console.log(e);
      // If something goes wrong we might want to let the user decrease the allowance
      const { hash: resetAllowanceHash } = await writeContract(resetAllowanceConfig);
      await waitForTransaction({ hash: resetAllowanceHash });

      //TODO: Show feedback to user
    }
     finally {
      setIsInvesting(false);
     }
  }

  return (
    <>
      <Head>
        <title>CryptoFundMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container sx={{ pt: 4 }} maxWidth="lg" fixed>
        <InvestModal props={{
          open,
          handleClose,
          onInvestClick: invest,
          investAmount: investAmount,
          setInvestAmount: setInvestAmount
        }} />

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={isInvesting}
          style={{ position: "absolute" }}
        >
          <CircularProgress color="inherit" sx={{ p: 1 }} />
          Investing... <br />Please review your wallet to approve the transactions
        </Backdrop>
        {project !== undefined &&
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
                            {project.funded.asTokenStandardUnit().toString()}/{project.goal.asTokenStandardUnit().toString()} Tokens funded
                          </Typography>
                        </Stack>
                        <LinearProgressWithLabel color="secondary" value={getProjectProgress()}></LinearProgressWithLabel>
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
        }
      </Container>
    </>
  );
}

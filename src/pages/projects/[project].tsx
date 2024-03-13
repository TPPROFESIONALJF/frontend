import { Backdrop, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Stack, Typography, debounce } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useContractRead, useAccount } from 'wagmi';
import { fundingManagerABI } from "@/contracts/FundingManager";
import { dummyDAIABI } from "@/contracts/DummyDAI";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import NotFound from './404';
import { ProjectStage, getIndustrieById, increaseAllowance, investOnProject, resetAllowance } from "@/utils/projectsUtils";
import Image from 'next/image';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import InvestModal from '@/components/InvestModal';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import '@/utils/numberUtils'
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { ReportMilestoneCard } from '@/components/MilestoneCards/ReportMilestoneCard';
import { StartMilestoneCard } from '@/components/MilestoneCards/StartMilestoneCard';
import { VotingResult } from '@/domain/VotingResult';
import { MilestoneExecution } from '@/domain/MilestoneExecution';
import { EndMilestoneCard } from '@/components/MilestoneCards/EndMilestoneCard';
import { EndMilestone, Milestone, ReportMilestone, StartMilestone } from '@/domain/Milestone';

export default function Project() {
  const [investAmount, setInvestAmount] = useState(0);
  const debouncedInvestAmount = useDebounce(investAmount, 500);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(BigInt(-1));
  const [isInvesting, setIsInvesting] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { address } = useAccount();
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

  const { data: fundedAmount } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'getFundedAmount',
    args: [projectId, address as `0x${string}`],
    watch: true
  });

  const { data: investorsNumber } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'getInvestorsNumberByProject',
    args: [projectId],
    watch: true
  });

  const { data: readBalance } = useContractRead({
    address: ContractAddresses.dummyDAIAddress as `0x${string}`,
    abi: dummyDAIABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    watch: true
  });

  const { data: milestonesExecutions } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'getMilestonesExecutions',
    args: [projectId],
    watch: true
  });

  const { data: nextMilestone } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'getNextMilestone',
    args: [projectId],
    watch: true
  });

  //let activeMilestone = buildMilestoneFromExecution(milestonesExecutions?.at(milestonesExecutions!!.length - 1));
  let activeMilestone = buildMilestoneFromExecution({
    projectId: BigInt(1),
    dcfScore: BigInt(0),
    proposalId: BigInt(0),
    startDate: BigInt(dayjs().unix()),
    endDate: project?.endDate ?? BigInt(dayjs().add(7, "day").unix()),
    stage: 0
  });

  // let calendarDates = project.milestonesDates;
  let calendarDates = undefined;
  if (project !== undefined) {
    let endDate1 = BigInt(dayjs.unix(Number(project!!.startDate)).add(7, "day").unix());
    let startDate2 = BigInt(dayjs.unix(Number(project!!.startDate)).add(2, "month").unix());
    let endDate2 = BigInt(dayjs.unix(Number(startDate2)).add(7, "day").unix());
    let endDate3 = BigInt(dayjs.unix(Number(project!!.endDate)).add(3, "month").unix());
    let startDate3 = BigInt(dayjs.unix(Number(endDate3)).subtract(7, "day").unix());
    calendarDates = project?.milestonesDates?.concat([
      { startDate: project.startDate, endDate: endDate1 },
      { startDate: startDate2, endDate: endDate2 },
      { startDate: startDate3, endDate: endDate3 },
      { startDate: project.endDate, endDate: project.endDate }
    ]);
  }

  if (project !== undefined && project.id === BigInt(0)) {
    return <NotFound />;
  }

  function buildMilestoneFromNextMilestone(nextMilestone: { startDate: bigint, endDate: bigint }): Milestone {
    if (nextMilestone.endDate === project?.endDate) {
      return new EndMilestone(
        dayjs.unix(Number(activeMilestone.startDate)),
        dayjs.unix(Number(activeMilestone.endDate)),
        getTokensToRelease(),
        0,
        false
      );
    } else if (nextMilestone.startDate === project?.startDate) {
      return new StartMilestone(
        dayjs.unix(Number(activeMilestone.startDate)),
        undefined,
        getTokensToRelease(),
        project.stage == ProjectStage.STARTED ? 0 : -1,
        false
      );
    } else {
      return new ReportMilestone(
        dayjs.unix(Number(activeMilestone.startDate)),
        dayjs.unix(Number(activeMilestone.endDate)),
        getTokensToRelease(),
        0,
        false,
        undefined
      );
    }
  }

  function buildMilestoneFromExecution(activeMilestone: MilestoneExecution): Milestone {
    if (activeMilestone.endDate === project?.endDate) {
      return new EndMilestone(
        dayjs.unix(Number(activeMilestone.startDate)),
        dayjs.unix(Number(activeMilestone.endDate)),
        getTokensToRelease(),
        activeMilestone.stage + 1,
        false
      );
    } else if (activeMilestone.startDate === project?.startDate) {
      return new StartMilestone(
        dayjs.unix(Number(activeMilestone.startDate)),
        undefined,
        getTokensToRelease(),
        activeMilestone.stage + 1,
        false
      );
    } else {
      return new ReportMilestone(
        dayjs.unix(Number(activeMilestone.startDate)),
        dayjs.unix(Number(activeMilestone.endDate)),
        getTokensToRelease(),
        0,
        false,
        undefined
      );
    }
  }

  function getTokensToRelease(): bigint {
    if (project === undefined) { return BigInt(0); }
    return (project.funded / project.releaseMilestonesQuantity).asTokenStandardUnit();
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
    if (readBalance != undefined && readBalance.asTokenStandardUnit() < investAmount) {
      enqueueSnackbar("Error: The amount you are trying to invest exceedes your balance", { variant: "error" });
      return;
    }
    try {
      setIsInvesting(true);
      // First let the user increase the allowance of tokens on our behalf
      await increaseAllowance(debouncedInvestAmount);

      // Second ask the user to approve the invest on the project
      await investOnProject(projectId, debouncedInvestAmount);

      setIsInvesting(false);
      handleClose();
      enqueueSnackbar("Your funds have been invested successfully", { variant: "success" });
    } catch (e) {
      setIsInvesting(false);
      if (e instanceof Error) {
        enqueueSnackbar("Oops! Something went wrong when trying to process your investment: " + e.message, { variant: "error" });
      }
      try {
        // If something goes wrong we might want to let the user decrease the allowance
        await resetAllowance();
        enqueueSnackbar("Your allowance has been successfully set to 0", { variant: "success" });
      } catch (e: unknown) {
        if (e instanceof Error) {
          enqueueSnackbar("Oops! Something went wrong when trying to revoke allowance: " + e.message, { variant: "error" });
        }
      }
    }
  }

  function makeVotingResults(): VotingResult {
    return { forVotes: 0, againstVotes: 0, waitingVotes: 0, userVotedFor: true, finalResult: true };
  }

  return (
    <>
      <Head>
        <title>CryptoFundMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SnackbarProvider autoHideDuration={5000} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }} />
      <Container sx={{ pt: 4 }} maxWidth="lg" fixed>
        <InvestModal props={{
          open,
          handleClose,
          onInvestClick: invest,
          investAmount: investAmount,
          setInvestAmount: setInvestAmount,
          balance: readBalance ? Number(readBalance.asTokenStandardUnit()) : 0
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
          <Stack spacing={4}>
            <Card sx={{ width: "100%", px: 4, py: 2 }}>
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
                              {(investorsNumber ?? 0).toString()} Unique contributors
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
                          {fundedAmount != undefined && fundedAmount > 0 &&
                            <Typography variant="body1" width="100%" textAlign="center">
                              You funded {fundedAmount.asTokenStandardUnit().toString()} tokens
                            </Typography>
                          }
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
            <Card sx={{ width: "100%", px: 4, py: 2 }}>
              <CardContent>
                <Typography
                  component="h3"
                  variant="h3"
                  fontWeight="fontWeightBold"
                  align="center"
                  sx={{ pb: 3 }}
                >
                  Milestones
                </Typography>
                <Stack direction="column" spacing={2}>
                  {activeMilestone &&
                    <Stack direction="column" spacing={2}>
                      <Typography
                        component="h5"
                        variant="h5"
                        fontWeight="fontWeightBold"
                      >
                        Active milestone
                      </Typography>
                      {activeMilestone instanceof ReportMilestone &&
                        <ReportMilestoneCard
                          milestone={activeMilestone as ReportMilestone}
                        />
                      }
                      {activeMilestone instanceof EndMilestone &&
                        <EndMilestoneCard milestone={activeMilestone} />
                      }
                    </Stack>
                  }
                  <Typography
                    component="h5"
                    variant="h5"
                    fontWeight="fontWeightBold"
                    sx={{ pt: 1 }}
                  >
                    Next milestone
                  </Typography>
                  <ReportMilestoneCard milestone={{
                    startDate: dayjs.unix(Number(project.startDate)).subtract(14, "day"),
                    endDate: dayjs.unix(Number(project.startDate)),
                    tokensToRelease: getTokensToRelease(),
                    activeStep: 3,
                    isOwnerView: false,
                    votingResults: makeVotingResults()
                  }}
                  />
                  <Typography
                    component="h5"
                    variant="h5"
                    fontWeight="fontWeightBold"
                    sx={{ pt: 1 }}
                  >
                    Milestones calendar
                  </Typography>
                  <Stack spacing={2}>
                    {calendarDates?.map((milestoneDates) => {
                      if (milestoneDates.startDate == project.startDate) {
                        return <StartMilestoneCard milestone={{
                          startDate: dayjs.unix(Number(milestoneDates.startDate)),
                          endDate: undefined,
                          tokensToRelease: getTokensToRelease(),
                          activeStep: -1,
                          isOwnerView: false
                        }} />
                      } else if (milestoneDates.startDate == project.endDate) {
                        return <EndMilestoneCard milestone={{
                          startDate: dayjs.unix(Number(milestoneDates.startDate)),
                          endDate: undefined,
                          tokensToRelease: getTokensToRelease(),
                          activeStep: -1,
                          isOwnerView: false
                        }} />
                      } else {
                        return <ReportMilestoneCard milestone={{
                          startDate: dayjs.unix(Number(milestoneDates.startDate)),
                          endDate: dayjs.unix(Number(milestoneDates.endDate)),
                          tokensToRelease: (project.funded / project.releaseMilestonesQuantity).asTokenStandardUnit(),
                          activeStep: -1,
                          isOwnerView: false,
                          votingResults: undefined
                        }}
                        />
                      }
                    })}
                  </Stack>
                  <Typography
                    component="h5"
                    variant="h5"
                    fontWeight="fontWeightBold"
                    sx={{ pt: 1 }}
                  >
                    Milestones history
                  </Typography>
                  <StartMilestoneCard milestone={{
                    startDate: dayjs.unix(Number(project.startDate)),
                    endDate: undefined,
                    tokensToRelease: (project.funded / project.releaseMilestonesQuantity).asTokenStandardUnit(),
                    activeStep: 0,
                    isOwnerView: false
                  }} />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        }
      </Container>
    </>
  );
}

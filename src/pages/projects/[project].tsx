import { Backdrop, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Stack, Typography, debounce } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useContractRead, useAccount, WagmiConfig } from 'wagmi';
import { fundingManagerABI } from "@/contracts/FundingManager";
import { governorABI } from "@/contracts/Governor";
import { dummyDAIABI } from "@/contracts/DummyDAI";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import NotFound from './404';
import { MilestoneStage, ProjectStage, getDocumentUrl, getImageUrl, getIndustrieById, increaseAllowance, investOnProject, resetAllowance, triggerUpkeep } from "@/utils/projectsUtils";
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
import statuses from '@/components/MilestoneCards/ReportMilestoneCard';
import { readContract } from '@wagmi/core';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { NorthWest } from '@mui/icons-material';

export default function Project() {
  const [investAmount, setInvestAmount] = useState(0);
  const debouncedInvestAmount = useDebounce(investAmount, 500);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(BigInt(-1));
  const [isInvesting, setIsInvesting] = useState(false);
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [documentUrl, setDocumentUrl] = useState<string | undefined>(undefined);
  const [executedMilestones, setExecutedMilestones] = useState<Milestone[] | undefined>(undefined);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const triggerStartUpkeep = async() => {
    await triggerUpkeep("0x01");
  };
  const triggerEndUpkeep = async() => {
    await triggerUpkeep("0x02");
  };
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

  let { data: nextMilestone } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'getNextMilestone',
    args: [projectId],
    watch: true
  });

  if (project !== undefined && project.id === BigInt(0)) {
    return <NotFound />;
  }

  let isOwnerView = address == project?.owner;

  buildExecutedMilestones();
  let activeMilestone: Milestone | undefined = undefined;
  let lastMilestoneExecution = executedMilestones?.at(milestonesExecutions!!.length - 1) as Milestone;
  if (lastMilestoneExecution != undefined && lastMilestoneExecution.stage == 0) {
    activeMilestone = executedMilestones?.at(milestonesExecutions!!.length - 1);
  }

  if (project?.stage == ProjectStage.FUNDING || project?.stage == ProjectStage.FINISHED) {
    nextMilestone = undefined;
  }

  let historyMilestones = executedMilestones?.filter((execution) => execution.stage == MilestoneStage.FINISHED);
  console.log(historyMilestones);

  function buildMilestoneCardForHistory(calendarMilestone: Milestone): JSX.Element {
    if (calendarMilestone instanceof StartMilestone) {
      return <StartMilestoneCard milestone={calendarMilestone} />
    } else if (calendarMilestone instanceof EndMilestone) {
      return <EndMilestoneCard milestone={calendarMilestone} />
    } else if (calendarMilestone instanceof ReportMilestone) {
      return <ReportMilestoneCard milestone={calendarMilestone} />
    }
    return <></>;
  }

  function buildMilestoneCardForFutureMilestones(milestoneDates: { startDate: bigint, endDate: bigint | undefined }): JSX.Element {
    const calendarMilestone = buildMilestoneForFutureMilestones(milestoneDates);
    if (calendarMilestone instanceof StartMilestone) {
      return <StartMilestoneCard milestone={calendarMilestone} />
    } else if (calendarMilestone instanceof EndMilestone) {
      return <EndMilestoneCard milestone={calendarMilestone} />
    } else if (calendarMilestone instanceof ReportMilestone) {
      return <ReportMilestoneCard milestone={calendarMilestone}
      />
    }
    return <></>;
  }

  function buildExecutedMilestones() {
    let milestones = milestonesExecutions?.map((execution) => {
      let milestone = buildMilestoneForMilestoneExecution(execution);
      return milestone;
    });
    if (milestones != undefined) {
      Promise.all(milestones).then((values) => {
        if (executedMilestones == undefined || executedMilestones.toString() != values.toString())
          setExecutedMilestones(values);
          if (imageUrl == undefined) {
            getImageUrl(ContractAddresses.fundingManagerAddress + project?.name).then((url) => {
              setImageUrl(url);
            });
          }
        });
        if (documentUrl == undefined) {
          getDocumentUrl(ContractAddresses.fundingManagerAddress + project?.name).then((url) => {
            setDocumentUrl(url);
          });
        }
    }
  }

  async function buildMilestoneForMilestoneExecution(execution: MilestoneExecution): Promise<Milestone> {
    if (execution.startDate == project?.startDate) {
      return new StartMilestone(
        execution.projectId,
        dayjs.unix(Number(execution.startDate)),
        undefined,
        getTokensToRelease(),
        isOwnerView,
        project.stage > ProjectStage.FUNDING,
        execution.stage
      );
    } else if (execution.endDate == project?.endDate) {
      return new EndMilestone(
        execution.projectId,
        dayjs.unix(Number(execution.startDate)),
        dayjs.unix(Number(execution.endDate)),
        getTokensToRelease(),
        isOwnerView,
        project.stage > ProjectStage.FUNDING,
        execution.stage
      );
    } else {
      let fileName = ContractAddresses.fundingManagerAddress + project?.name;
      return new ReportMilestone(
        execution.projectId,
        dayjs.unix(Number(execution.startDate)),
        dayjs.unix(Number(execution.endDate)),
        getTokensToRelease(),
        isOwnerView,
        project != undefined && project.stage > ProjectStage.FUNDING,
        execution.stage,
        await getVotingResults(execution.proposalId),
        uploadDocuments,
        execution.proposalId,
        fileName,
        documentUrl
      );
    }
  }

  function buildMilestoneForFutureMilestones(milestoneDates: { startDate: bigint, endDate: bigint | undefined }): Milestone {
    if (project === undefined) { throw Error("No project provided"); }
    if (milestoneDates.startDate == project.startDate) {
      return new StartMilestone(
        BigInt(-1),
        dayjs.unix(Number(milestoneDates.startDate)),
        undefined,
        getTokensToRelease(),
        isOwnerView,
        false,
        -1
      );
    } else if (milestoneDates.endDate == project.endDate) {
      return new EndMilestone(
        BigInt(-1),
        dayjs.unix(Number(milestoneDates.startDate)),
        dayjs.unix(Number(milestoneDates.endDate)),
        getTokensToRelease(),
        isOwnerView,
        false,
        -1
      );
    } else {
      return new ReportMilestone(
        BigInt(-1),
        dayjs.unix(Number(milestoneDates.startDate)),
        dayjs.unix(Number(milestoneDates.endDate)),
        getTokensToRelease(),
        isOwnerView,
        false,
        -1,
        undefined,
        uploadDocuments,
        BigInt(0),
        undefined,
        undefined
      );
    }
  }

  function getTokensToRelease(): bigint {
    if (project === undefined) { return BigInt(0); }
    if (project.stage == ProjectStage.FUNDING) {
      return (project.goal / project.releaseMilestonesQuantity).asTokenStandardUnit()
    }
    return (project.funded / project.releaseMilestonesQuantity).asTokenStandardUnit();
  }

  function getIndustrieName(): string {
    if (project === undefined) { return "N/A" }
    return getIndustrieById(project!!.industrie.toString())!!.name;
  }

  function getProjectProgress(): number {
    return project
      ? Number(project.funded * BigInt(100) / project.goal)
      : 0;
  }

  function getProjectEvaluation(): string {
    if (project?.evaluation == 0) {
      return "DCF Evaluation: Low performance";
    } else if (project?.evaluation == 1) {
      return "DCF Evaluation: Average performance";
    } else if (project?.evaluation == 2) {
       return "DCF Evaluation: High performance";
    } else {
      return "DCF Evaluation: Not evaluated";
    }
  }

  async function uploadDocuments(file: File): boolean {
    try {
      setIsUploadingDocuments(true);
      await handleUpload(file);
      setIsUploadingDocuments(false);
      enqueueSnackbar("Your documents and evaluation have been uploaded successfully", { variant: "success" });
      return true;
    } catch (e) {
      setIsUploadingDocuments(false);
      if (e instanceof Error) {
        enqueueSnackbar("Oops! Something went wrong when trying to process your evaluation: " + e.message, { variant: "error" });
      }
      return false;
    }
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

  async function proposalStatus(proposalId: bigint) : Promise<string> {
    
    const status = await readContract({
      address: ContractAddresses.governorAddress as `0x${string}`,
      abi: governorABI,
      functionName: 'state',
      args: [proposalId]
    });

    console.log("status :", status);
    if (status != undefined && status){
      return statuses[status] as string;
    }
    return "";
  }

  async function getVotingResults(proposalId: bigint) : Promise<VotingResult | undefined> {
    const results = await readContract({
      address: ContractAddresses.governorAddress as `0x${string}`,
      abi: governorABI,
      functionName: 'proposalVotes',
      args: [proposalId]
    });

    const status = await proposalStatus(proposalId);

    let finalResult: boolean = false;

    if (status == statuses[4]){
      console.log("status Succeeded")
      finalResult = true;
    }

    let forVotes = 0;
    let againstVotes = 0;
    let abstainVotes = 0;

    if (results != undefined){
      finalResult = (results[1]+results[2]) > results[0];
      forVotes = Number(results[1].asTokenStandardUnit());
      againstVotes = Number(results[0].asTokenStandardUnit());
      abstainVotes = Number(results[2].asTokenStandardUnit());
    }

    return { forVotes: forVotes, againstVotes: againstVotes, abstainVotes: abstainVotes, finalResult: finalResult };
  }

  const handleUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No file selected');
        return;
      }
      let fileName = ContractAddresses.fundingManagerAddress + project?.name;
      const storageRef = ref(storage, `documents/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

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
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={isUploadingDocuments}
          style={{ position: "absolute" }}
        >
          <CircularProgress color="inherit" sx={{ p: 1 }} />
          Uploading documents and calculating score... <br />Please review your wallet to approve the transaction
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
                        image={imageUrl}>
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
                              src="/frontend/images/evaluation.png"
                              alt="Evaluation Logo"
                              width="0"
                              height="0"
                              sizes="100vw"
                              style={{ height: 'auto', width: '36px' }}
                            />
                            <Typography variant="body1">
                              {getProjectEvaluation()}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="center">
                            <Image
                              src="/frontend/images/investors.png"
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
                              src="/frontend/images/token.png"
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
                      {project?.description}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ width: "100%", px: 4, py: 2 }}>
              <CardContent>
                {/*
                <Button onClick={triggerStartUpkeep}>Trigger start upkeep</Button>
                <Button onClick={triggerEndUpkeep}>Trigger end upkeep</Button>
                 */}
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
                      {activeMilestone instanceof StartMilestone &&
                        <StartMilestoneCard milestone={activeMilestone} />
                      }
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
                  {nextMilestone &&
                    <Stack direction="column" spacing={2}>
                      <Typography
                        component="h5"
                        variant="h5"
                        fontWeight="fontWeightBold"
                        sx={{ pt: 1 }}
                      >
                        Next milestone
                      </Typography>
                      {buildMilestoneCardForFutureMilestones(nextMilestone)}
                    </Stack>
                  }
                  {project.milestonesDates.length > 0 &&
                    <Stack direction="column" spacing={2}>
                      <Typography
                        component="h5"
                        variant="h5"
                        fontWeight="fontWeightBold"
                        sx={{ pt: 1 }}
                      >
                        Milestones calendar
                      </Typography>
                      <Stack spacing={2}>
                        {project.milestonesDates.map((milestoneDates) => {
                          return buildMilestoneCardForFutureMilestones(milestoneDates);
                        })}
                      </Stack>
                    </Stack>
                  }
                  {historyMilestones && historyMilestones.length > 0 &&
                    <Stack direction="column" spacing={2}>
                      <Typography
                        component="h5"
                        variant="h5"
                        fontWeight="fontWeightBold"
                        sx={{ pt: 1 }}
                      >
                        Milestones history
                      </Typography>
                      {historyMilestones?.map((execution) => {
                        return buildMilestoneCardForHistory(execution);
                      })}
                    </Stack>
                  }
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        }
      </Container>
    </>
  );
}

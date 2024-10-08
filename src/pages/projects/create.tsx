import { Backdrop, Box, Button, CircularProgress, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { waitForTransaction, writeContract, prepareWriteContract } from '@wagmi/core'
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Head from "next/head";
import { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useContractRead } from 'wagmi'
import { fundingManagerABI } from "@/contracts/FundingManager";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { useRouter } from 'next/navigation';
import industries from "@/utils/projectsUtils";
import '@/utils/numberUtils';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import UploadField from "@/components/UploadField";

// If we change this, we have to change the smart contract minimum span between milestones
const durationUnit = "month";

const milestoneSpans = [
  {
    value: '3',
    label: `3 ${durationUnit}s`,
  },
  {
    value: '4',
    label: `4 ${durationUnit}s`,
  },
  {
    value: '6',
    label: `6 ${durationUnit}s`,
  },
  {
    value: '12',
    label: `12 ${durationUnit}s`,
  },
];

const projectDurations = [
  {
    value: '3',
    label: `3 ${durationUnit}s`,
  },
  {
    value: '6',
    label: `6 ${durationUnit}s`,
  },
  {
    value: '9',
    label: `9 ${durationUnit}s`,
  },
  {
    value: '12',
    label: `12 ${durationUnit}s`,
  },
];


export default function ProjectCreate() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<number>(3);
  const [name, setName] = useState<string | null>(null);
  const [description, setProjectDescription] = useState<string | null>(null);
  const [industrie, setIndustrie] = useState<number | null>(null);
  const [goal, setGoal] = useState<bigint | null>(null);
  const [milestoneSpan, setMilestoneSpan] = useState<number>(3);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [cashFlows, setCashFlows] = useState("");
  const [ebitda, setEbitda] = useState(0);
  const router = useRouter();

  const { data: minGoal } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'MIN_GOAL'
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No file selected');
        return;
      }
      let fileName = ContractAddresses.fundingManagerAddress + name;
      const storageRef = ref(storage, `public/${fileName}`);
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
            setUrl(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  function calculateMilestonesDates(): bigint[] {
    let milestoneDate = startDate?.startOf("month")?.add(milestoneSpan, "month");;
    let endDate = startDate?.startOf("month")?.add(duration, "month");
    let dates: bigint[] = [];
    while (milestoneDate?.isBefore(endDate)) {
      dates.push(BigInt(milestoneDate.unix()));
      milestoneDate = milestoneDate.add(milestoneSpan, "month");
    }
    return dates;
  }

  async function createDemoProject() {
    let splittedCashFlows = cashFlows.split(",").map(cashFlow => BigInt(parseFloat(cashFlow)));
    const { request: config } = await prepareWriteContract({
      address: ContractAddresses.fundingManagerAddress as `0x${string}`,
      abi: fundingManagerABI,
      functionName: 'createDemoProject',
      args: [
        goal?.asTokenSmallestUnit() ?? BigInt(-1),
        name!!,
        description!!,
        industrie!!,
        splittedCashFlows as [bigint, bigint, bigint, bigint, bigint],
        ebitda.asTokenSmallestUnit()
      ]
    });

    const { hash: createProjectHash } = await writeContract(config);
    await waitForTransaction({ hash: createProjectHash });
  }

  async function createProject() {
    let splittedCashFlows = cashFlows.split(",").map(cashFlow => BigInt(parseFloat(cashFlow)));
    const { request: config } = await prepareWriteContract({
      address: ContractAddresses.fundingManagerAddress as `0x${string}`,
      abi: fundingManagerABI,
      functionName: 'create',
      args: [
        goal?.asTokenSmallestUnit() ?? BigInt(-1),
        name!!,
        description!!,
        industrie!!,
        BigInt(startDate?.startOf("month").unix() ?? dayjs().unix()),
        BigInt(startDate?.startOf("month").add(duration, durationUnit).unix() ?? dayjs().unix()),
        calculateMilestonesDates(),
        splittedCashFlows as [bigint, bigint, bigint, bigint, bigint],
        ebitda.asTokenSmallestUnit()
      ]
    });

    const { hash: createProjectHash } = await writeContract(config);
    await waitForTransaction({ hash: createProjectHash });
  }


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setOpenBackdrop(true);
    if (milestoneSpan > duration) {
      enqueueSnackbar("Error: Project duration should be greater than milestones span", { variant: "error" });
      setOpenBackdrop(false);
      return;
    }
    if (goal != null && goal < minGoal!!.asTokenStandardUnit()) {
      enqueueSnackbar(`Error: Goal should be at least ${minGoal?.asTokenStandardUnit()} tokens`, { variant: "error" });
      setOpenBackdrop(false);
      return;
    }
    if (cashFlows.split(",").length != 5) {
      enqueueSnackbar("Error: You must set 5 values for cash flow", { variant: "error" });
      setOpenBackdrop(false);
      return;
    }
    try {
      await handleUpload();
      //await createProject();
      await createDemoProject();
      router.replace("/projects");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e?.message);
        enqueueSnackbar(`${e?.message}`, { variant: "error" });
        enqueueSnackbar(`Error: ${e?.cause}`, { variant: "error" });
      }
    } finally {
      setOpenBackdrop(false);
    }
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
      <Box className='mainContainer'>
        <Typography
          component="h1"
          variant="h1"
          fontWeight="fontWeightBold"
          gutterBottom
        >
          New project
        </Typography>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
          style={{ position: "absolute" }}
        >
          <CircularProgress color="inherit" sx={{ p: 1 }} />
          Creating project, please wait...
        </Backdrop>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid
            style={{ position: "relative" }}
            container
            spacing={2}>
            <Grid item xs={12} md={12} lg={4}>
              <TextField
                label="Project name"
                variant="outlined"
                fullWidth={true}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <TextField
                select
                label="Select your industrie"
                onChange={(e) => setIndustrie(parseInt(e.target.value))}
                required
                fullWidth
              >
                {industries.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <TextField
                type="number"
                label="Funding goal"
                variant="outlined"
                onChange={(e) => setGoal(BigInt(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">TOKENS</InputAdornment>,
                }}
                fullWidth={true}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <DatePicker
                label="Start month"
                disablePast
                onChange={(date: string | null) =>
                  setStartDate(date != null ? dayjs(date) : null)
                }
                slotProps={{ textField: { fullWidth: true, required: true } }}
                views={['year', 'month']}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                select
                label="Select your project duration"
                defaultValue="3"
                onChange={(e) => setDuration(parseInt(e.target.value))}
                required
                fullWidth
              >
                {projectDurations.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <TextField
                select
                label="Select your milestone span"
                defaultValue="3"
                onChange={(e) => setMilestoneSpan(parseInt(e.target.value))}
                required
                fullWidth
                helperText="Every how many months you want to execute a milestone"
              >
                {milestoneSpans.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>    
            <Grid item xs={12} md={12} lg={12}>
              <TextField
                multiline
                rows={3}
                label="Project description"
                onChange={(e) => setProjectDescription(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <UploadField fileName={fileName} label="Project image" onFileChange={handleFileChange} />
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <TextField
                label="Cash flows (separated by comma)"
                onChange={(e) => setCashFlows(e.target.value)}
                required
                fullWidth
                helperText="Cash flows for the next 5 years to execute DCF"
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <TextField
                label="Ebitda"
                onChange={(e) => setEbitda(parseFloat(e.target.value))}
                required
                fullWidth
                helperText="Current year ebitda to execute DCF"
              >
              </TextField>
            </Grid>
            <Grid item xs={0} lg={3} />
            <Grid item xs={12} lg={6}>
              <Box display="flex">
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                >
                  Create project
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}

import { Backdrop, Box, Button, CircularProgress, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Head from "next/head";
import { FormEvent } from "react";
import { useState } from "react";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { fundingManagerABI } from "@/contracts/FundingManager";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { useRouter } from 'next/navigation';
import industries from "@/utils/projectsUtils";
import '@/utils/numberUtils'

const milestoneSpans = [
  {
    value: '3',
    label: '3 months',
  },
  {
    value: '4',
    label: '4 months',
  },
  {
    value: '6',
    label: '6 months',
  },
  {
    value: '12',
    label: '12 months',
  },
];

export default function ProjectCreate() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [industrie, setIndustrie] = useState<number | null>(null);
  const [goal, setGoal] = useState<bigint | null>(null);
  const [milestoneSpan, setMilestoneSpan] = useState<number>(3);

  const { config } = usePrepareContractWrite({
    address: ContractAddresses.fundingManagerAddress as `0x${string}`,
    abi: fundingManagerABI,
    functionName: 'create',
    args: [
      goal?.asTokenSmallestUnit() ?? BigInt(-1),
      name!!,
      industrie!!,
      BigInt(startDate?.unix() ?? dayjs().unix()),
      BigInt(endDate?.unix() ?? dayjs().unix()),
      calculateMilestonesMonths()
    ]
  });
  const { data, write: create } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (isSuccess) {
    useRouter().replace("/projects");
  }

  function calculateMilestonesMonths(): number[] {
    let auxDate = startDate;
    let milestoneMonths = [];
    while (auxDate?.isBefore(endDate)) {
      if (milestoneMonths.indexOf(auxDate.month()) !== -1) {
        // if i get here it means i already cycled on 1 full year months
        return milestoneMonths;
      }
      milestoneMonths.push(auxDate.month());
      auxDate = auxDate.add(milestoneSpan, 'month');
    }
    return milestoneMonths;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    create?.();
  }

  function shouldDisableEndMonth(date: string): boolean {
    return (dayjs(date)).isBefore(startDate, 'month');
  }

  function shouldDisableEndYear(date: string): boolean {
    return (dayjs(date)).isBefore(startDate, 'year');
  }

  return (
    <>
      <Head>
        <title>CryptoFundMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
          open={isLoading}
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
              <DatePicker
                label="End month"
                onChange={(date: string | null) =>
                  setEndDate(date != null ? dayjs(date) : null)
                }
                shouldDisableMonth={shouldDisableEndMonth}
                shouldDisableYear={shouldDisableEndYear}
                disablePast
                slotProps={{ textField: { fullWidth: true, required: true } }}
                views={['year', 'month']}
              />
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

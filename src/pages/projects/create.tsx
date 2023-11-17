import { Box, Button, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import Head from "next/head";
import { FormEvent } from "react";
import { useState } from "react";

const milestoneSpans = [
  {
    value: '3',
    label: '3 months',
  },
  {
    value: '6',
    label: '6 months',
  },
  {
    value: '9',
    label: '9 months',
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
  const [goal, setGoal] = useState<number | null>(null);
  const [milestoneSpan, setMilestoneSpan] = useState<number>(3);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
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
        <form onSubmit={(e) => handleSubmit(e)}>
          <Grid
            container
            spacing={2}>
            <Grid item xs={12} md={12} lg={6}>
              <TextField
                label="Project name"
                variant="outlined"
                fullWidth={true}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <TextField
                type="number"
                label="Funding goal"
                variant="outlined"
                onChange={(e) => setGoal(parseInt(e.target.value))}
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

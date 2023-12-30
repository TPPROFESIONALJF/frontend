import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { fundingManagerABI } from "@/contracts/FundingManager";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { useContractRead } from 'wagmi';
import ProjectCard from './ProjectCard';

export default function Projects() {
  const { data, isError, isLoading } = useContractRead({
    address: ContractAddresses.fundingManagerAddress as `0x$cd{string}`,
    abi: fundingManagerABI,
    functionName: 'getProjects'
  });

  return (
    <>
        <Container maxWidth={false}>
          <Typography
            component="h1"
            variant="h1"
            fontWeight="fontWeightBold"
            gutterBottom
          >
            Projects
          </Typography>
          <Stack
            direction="row"
            justifyContent="end"
          >
          </Stack>
          <Grid container spacing={4}>
            {data?.map((project) => (
              <ProjectCard data={project} />
            ))}
          </Grid>
        </Container>
    </>
  );
}
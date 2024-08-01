import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { getDates } from "@/utils/stepsUtils";
import { Button, Stack, Step, StepContent, StepLabel, Typography } from "@mui/material";
import { VotingResults } from "./VotingResults";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { useAccount, useContractRead } from "wagmi";
import { governorABI } from "@/contracts/Governor";

interface VotingInProgressStepProps {
  step: VotingInProgressMilestoneStepData;
}

export function VotingInProgressStep({ step, ...other }: VotingInProgressStepProps) {
  const { address } = useAccount();

  const { data: hasVoted } = useContractRead({
    address: ContractAddresses.governorAddress as `0x${string}`,
    abi: governorABI,
    functionName: 'hasVoted',
    args: [step.proposalId, address ?? "" as `0x${string}`],
    watch: true
  });

  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>
  return (
    <Step key={step!!.name} {...stepProps} {...other} active={true}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
        { hasVoted && 
          <Stack direction="row" spacing={1} justifyContent="space-around" color="info.main" alignItems="center" sx={{ pt: 2 }}>You already voted! Please wait wait until the voting finishes</Stack>}
        { !hasVoted &&
            <Stack direction="row" spacing={1}>
              <Button fullWidth variant="contained" color="success" sx={{ fontWeight: "bold" }} onClick={() => step.onVoteCast(step.proposalId, 1)}>FOR (Continue project)</Button>
              <Button fullWidth variant="contained" color="error" onClick={() => step.onVoteCast(step.proposalId ,0)}>AGAINST (Cancel project)</Button>
            </Stack>
        }
      </StepContent>
    </Step>
  );
}

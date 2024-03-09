import { getDates } from "@/utils/stepsUtils";
import { Step, StepContent, StepLabel, Typography } from "@mui/material";
import { VotingResults } from "./VotingResults";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";

interface VotingResultsStepProps {
  step: VotingResultsMilestoneStepData;
}

export function VotingResultsStep({ step, ...other }: VotingResultsStepProps) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>
  return (
    <Step key={step!!.name} {...stepProps} {...other} active={step.voteResults !== undefined}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
          <VotingResults results={step.voteResults} />
      </StepContent>
    </Step>
  );
}

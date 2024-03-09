import { VotingResultsMilestoneStep } from "@/domain/VotingResultsMilestoneStep";
import { getDates } from "@/utils/stepsUtils";
import { Step, StepContent, StepLabel, Typography } from "@mui/material";
import { VotingResults } from "./VotingResults";

interface VotingResultsStepProps {
  step: VotingResultsMilestoneStep;
}

export function VotingResultsStep({ step, ...other }: VotingResultsStepProps) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>
  return (
    <Step key={step!!.name} {...stepProps} {...other}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
          <VotingResults results={step.voteResults} />
      </StepContent>
    </Step>
  );
}

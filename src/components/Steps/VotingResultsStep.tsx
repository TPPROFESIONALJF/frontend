import { getDates } from "@/utils/stepsUtils";
import { Step, StepContent, StepLabel, Typography } from "@mui/material";
import { VotingResults } from "./VotingResults";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";
import dayjs from "dayjs";

interface VotingResultsStepProps {
  step: VotingResultsMilestoneStepData;
}

export function VotingResultsStep({ step, ...other }: VotingResultsStepProps) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>
  console.log("VOTE RESULTS")
  console.log(step.voteResults?.finalResult)
  console.log("END DATE")
  console.log(step.endDate);
  console.log("DATE NOW")
  console.log(dayjs());
  return (
    <Step key={step!!.name} {...stepProps} {...other} active={step.voteResults?.finalResult !== undefined}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
          { step.endDate != undefined && step.endDate <= dayjs() &&
            <VotingResults results={step.voteResults} />
          } 
      </StepContent>
    </Step>
  );
}

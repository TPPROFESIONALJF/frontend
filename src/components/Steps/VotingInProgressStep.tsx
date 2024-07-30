import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { getDates } from "@/utils/stepsUtils";
import { Button, Stack, Step, StepContent, StepLabel, Typography } from "@mui/material";
import { VotingResults } from "./VotingResults";

interface VotingInProgressStepProps {
  step: VotingInProgressMilestoneStepData;
}

export function VotingInProgressStep({ step, ...other }: VotingInProgressStepProps) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>
  return (
    <Step key={step!!.name} {...stepProps} {...other} active={true}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
        {
          
         
                <Stack direction="row" spacing={1}>
                  <Button fullWidth variant="contained" color="success" sx={{ fontWeight: "bold" }} onClick={() => step.onVoteCast(step.proposalId, 1)}>FOR (Continue project)</Button>
                  <Button fullWidth variant="contained" color="error" onClick={() => step.onVoteCast(step.proposalId ,0)}>AGAINST (Cancel project)</Button>
                </Stack>
              
        }
      </StepContent>
    </Step>
  );
}

import { EndMilestoneStepData } from "@/domain/EndMilestoneStepData";
import { getDates } from "@/utils/stepsUtils";
import { Button, Step, StepContent, StepLabel, Typography } from "@mui/material";

interface EndMilestoneStepProps {
  step: EndMilestoneStepData;
}

export function EndMilestoneStep({ step, ...other }: EndMilestoneStepProps) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step.caption}</Typography>;
  return (
    <Step key={step?.name} {...stepProps} {...other}>
      <StepLabel {...labelProps}>({getDates(step)}) {step?.name}</StepLabel>
    </Step>
  );
}

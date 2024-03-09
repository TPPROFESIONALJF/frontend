import { MilestoneStepData } from "@/domain/MilestoneStep";
import { getDates } from "@/utils/stepsUtils";
import { Button, Step, StepContent, StepLabel, Typography } from "@mui/material";

interface DocumentUploadStepProps {
  step: MilestoneStepData;
}

export function DocumentUploadStep({ step, ...other }: DocumentUploadStepProps) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>

  return (
    <Step key={step!!.name} {...stepProps} {...other}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
        {
          step.isOwnerView ? <Button>Upload documents</Button> : ""
        }
      </StepContent>
    </Step>
  );
}

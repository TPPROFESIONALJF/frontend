import { Button, Step, StepContent, StepLabel, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

export class MilestoneStep {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  caption: string;
  isOwnerView: boolean;

  constructor(_name: string, _startDate: Dayjs, _endDate: Dayjs | undefined, _caption: string) {
    this.name = _name;
    this.startDate = _startDate;
    this.endDate = _endDate;
    this.caption = _caption;
    this.isOwnerView = false;
  }
}

function getDates(step: MilestoneStep) {
  return step.endDate
    ? `${step.startDate.format('DD/MM/YYYY')} - ${step.endDate.format('DD/MM/YYYY')}`
    : `${step.startDate.format('DD/MM/YYYY')}`
}

export function DocumentUploadStep(step: MilestoneStep) {
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>

  return (
    <Step key={step!!.name} {...stepProps}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
        {
          step.isOwnerView ? <Button>Upload documents</Button> : ""
        }
      </StepContent>
    </Step>
  );
}

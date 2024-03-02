import { Button, Stack, Step, StepContent, StepLabel, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

export class MilestoneStep {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  caption: string;
  isOwnerView: boolean;

  constructor(_name: string, _startDate: Dayjs, _endDate: Dayjs | undefined, _caption: string, _isOwnerView: boolean) {
    this.name = _name;
    this.startDate = _startDate;
    this.endDate = _endDate;
    this.caption = _caption;
    this.isOwnerView = _isOwnerView;
  }
}

export class VotingInProgressMilestoneStep extends MilestoneStep {
  alreadyVoted: boolean;
  // Will be called with true if voting for and false if voting against
  onVoteCast: (voteFor: boolean) => void;

  constructor(
    _name: string,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _caption: string,
    _isOwnerView: boolean,
    _alreadyVoted: boolean,
    _onVoteCast: (voteFor: boolean) => void) {
    super(_name, _startDate, _endDate, _caption, _isOwnerView);
    this.alreadyVoted = _alreadyVoted;
    this.onVoteCast = _onVoteCast;
  }
}

function getDates(step: MilestoneStep) {
  return step.endDate
    ? `${step.startDate.format('DD/MM/YYYY')} - ${step.endDate.format('DD/MM/YYYY')}`
    : `${step.startDate.format('DD/MM/YYYY')}`
}

interface DocumentUploadStepProps {
  step: MilestoneStep;
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

interface VotingInProgressStepProps {
  step: VotingInProgressMilestoneStep;
}

export function VotingInProgressStep({ step, ...other }: VotingInProgressStepProps) {
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
          step.isOwnerView ? ""
            : (step.alreadyVoted ? "already voted"
              : <Stack direction="row" spacing={1}>
                <Button fullWidth variant="contained" color="success" sx={{ fontWeight: "bold" }} onClick={() => step.onVoteCast(true)}>FOR (Continue project)</Button>
                <Button fullWidth variant="contained" color="error" onClick={() => step.onVoteCast(false)}>AGAINST (Cancel project)</Button>
              </Stack>
            )
        }
      </StepContent>
    </Step>
  );
}

export function VotingResults() {
  return (
    <Stack direction="row">
      
    </Stack>
  );
}
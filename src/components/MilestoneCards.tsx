import { Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Dayjs } from 'dayjs';
import { useState } from "react";
import { DocumentUploadStep, MilestoneStep, VotingInProgressMilestoneStep, VotingInProgressStep } from "./MilestoneSteps";

interface MilestoneProps {
  milestone: Milestone;
}

interface Milestone {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  tokensToRelease: bigint;
  activeStep: number;
  isOwnerView: boolean;
}

function getDates(step: MilestoneStep) {
  return step.endDate
    ? `${step.startDate.format('DD/MM/YYYY')} - ${step.endDate.format('DD/MM/YYYY')}`
    : `${step.startDate.format('DD/MM/YYYY')}`
}

function getCardTitle(milestone: Milestone) {
  return milestone.endDate
    ? `${milestone.startDate.format('DD/MM/YYYY')} - ${milestone.endDate.format('DD/MM/YYYY')}`
    : `${milestone.startDate.format('DD/MM/YYYY')}`
}

function onVoteCast(voteFor: boolean) {
  // TODO: Add vote cast logic
  console.log(voteFor);
}

export function StartMilestoneCard({ milestone }: MilestoneProps) {
  const [activeStep, setActiveStep] = useState(milestone.activeStep);

  const steps = [
    new MilestoneStep(
      "Funding release",
      milestone.startDate,
      undefined,
      milestone.tokensToRelease.toString() + ((activeStep == 0) ? "tokens to release" : "tokens released"),
      milestone.isOwnerView
    )
  ];

  return (
    <>
      <Card variant="outlined"
        sx={{
          height: "100%",
          borderRadius: 2,
          backgroundColor: 'background.default',
          borderColor: 'primary.main'
        }}>
        <CardContent>
          <Typography
            component="h1"
            variant="h5"
            fontWeight="fontWeightBold"
          >
            Project Start
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="gray"
            fontWeight="fontWeightBold"
            gutterBottom
          >
            {getDates(steps[0])}
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              labelProps.optional = activeStep == 0 ? (
                <Typography variant="body2">{milestone.tokensToRelease.toString()} tokens to release</Typography>
              ) : <Typography variant="body2">{milestone.tokensToRelease.toString()} tokens released</Typography>;
              return (
                <Step key={step?.name} {...stepProps}>
                  <StepLabel {...labelProps}>({getDates(step)}) {step?.name}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>
    </>
  );
}

export function ReportMilestoneCard({ milestone }: MilestoneProps) {
  const [activeStep, setActiveStep] = useState(milestone.activeStep);

  const steps = [
    buildMilestoneSteps(0),
    buildMilestoneSteps(1),
    buildMilestoneSteps(2),
    buildMilestoneSteps(3)
  ];

  function buildMilestoneSteps(stepNumber: number): MilestoneStep {
    const startDate = milestone.startDate;
    const endDate = milestone.endDate;
    const middleDate = startDate.add(7, "day"); // TODO: Replace logic with (endDate - startDate)/2 minutes (to allow minutes milestones)
    if (stepNumber == 0) {
      return new MilestoneStep("Report documents upload", startDate, middleDate, "", milestone.isOwnerView);
    } else if (stepNumber == 1) {
      return new VotingInProgressMilestoneStep("Voting period", middleDate, endDate, "", milestone.isOwnerView, false, onVoteCast);
    } else if (stepNumber == 2) {
      return new MilestoneStep("Voting results", endDate!!, undefined, "", milestone.isOwnerView);
    } else if (stepNumber == 3) {
      return new MilestoneStep("Funding release/project cancellation", endDate!!, undefined, `${milestone.tokensToRelease.toString()} tokens to release`, milestone.isOwnerView)
    } else {
      return new MilestoneStep("DEFAULT", startDate, startDate, "", milestone.isOwnerView);
    }
  }

  return (
    <>
      <Card variant="outlined"
        sx={{
          height: "100%",
          borderRadius: 2,
          backgroundColor: 'background.default',
          borderColor: 'primary.main'
        }}>
        <CardContent>
          <Typography
            component="h1"
            variant="h5"
            fontWeight="fontWeightBold"
          >
            {milestone.endDate?.format("MMMM")} Report
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="gray"
            fontWeight="fontWeightBold"
            gutterBottom
          >
            {getCardTitle(milestone)}
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => {
              if (step instanceof VotingInProgressMilestoneStep) {
                return <VotingInProgressStep step={step} />
              } else {
                return <DocumentUploadStep step={step} />
              }
            })}
          </Stepper>
        </CardContent>
      </Card>
    </>
  );
}

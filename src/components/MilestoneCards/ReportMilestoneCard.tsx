import { Milestone, MilestoneProps, ReportMilestoneProps } from "@/domain/Milestone";
import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { DocumentUploadStep } from "../Steps/DocumentUploadStep";
import { VotingInProgressStep } from "../Steps/VotingInProgressStep";
import { VotingResultsStep } from "../Steps/VotingResultsStep";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";
import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";
import { EndMilestoneStepData } from "@/domain/EndMilestoneStepData";
import { EndMilestoneStep } from "../Steps/EndMilestoneStep";
import { buildMilestoneSteps } from "@/utils/stepsUtils";


function getCardTitle(milestone: Milestone) {
  return milestone.endDate
    ? `${milestone.startDate.format('DD/MM/YYYY')} - ${milestone.endDate.format('DD/MM/YYYY')}`
    : `${milestone.startDate.format('DD/MM/YYYY')}`
}

function onVoteCast(voteFor: boolean) {
  // TODO: Add vote cast logic
  console.log(voteFor);
}

export function ReportMilestoneCard({ milestone }: ReportMilestoneProps) {
  const [activeStep, setActiveStep] = useState(milestone.activeStep);

  const steps = [
    buildMilestoneSteps(milestone, 0, onVoteCast),
    buildMilestoneSteps(milestone, 1, onVoteCast),
    buildMilestoneSteps(milestone, 2, onVoteCast),
    buildMilestoneSteps(milestone, 3, onVoteCast)
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
              if (step instanceof VotingInProgressMilestoneStepData) {
                return <VotingInProgressStep step={step} />
              } else if (step instanceof VotingResultsMilestoneStepData) {
                return <VotingResultsStep step={step} />
              } else if (step instanceof DocumentUploadStepData) {
                return <DocumentUploadStep step={step} />
              } else if (step instanceof EndMilestoneStepData) {
                return <EndMilestoneStep step={step} />
              }
            })}
          </Stepper>
        </CardContent>
      </Card>
    </>
  );
}

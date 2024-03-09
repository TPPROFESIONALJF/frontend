import { Milestone, MilestoneProps } from "@/domain/Milestone";
import { MilestoneStepData } from "@/domain/MilestoneStepData";
import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { VotingResult } from "@/domain/VotingResult";
import { Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { DocumentUploadStep } from "../Steps/DocumentUploadStep";
import { VotingInProgressStep } from "../Steps/VotingInProgressStep";
import { VotingResultsStep } from "../Steps/VotingResultsStep";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";
import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";


function getCardTitle(milestone: Milestone) {
  return milestone.endDate
    ? `${milestone.startDate.format('DD/MM/YYYY')} - ${milestone.endDate.format('DD/MM/YYYY')}`
    : `${milestone.startDate.format('DD/MM/YYYY')}`
}

function onVoteCast(voteFor: boolean) {
  // TODO: Add vote cast logic
  console.log(voteFor);
}

export function ReportMilestoneCard({ milestone }: MilestoneProps) {
  const [activeStep, setActiveStep] = useState(milestone.activeStep);

  const steps = [
    buildMilestoneSteps(0),
    buildMilestoneSteps(1),
    buildMilestoneSteps(2),
    buildMilestoneSteps(3)
  ];

  function buildMilestoneSteps(stepNumber: number): MilestoneStepData {
    const startDate = milestone.startDate;
    const endDate = milestone.endDate;
    const middleDate = startDate.add(7, "day"); // TODO: Replace logic with (endDate - startDate)/2 minutes (to allow minutes milestones)
    const votingResults = makeVotingResults();
    if (stepNumber == 0) {
      return new DocumentUploadStepData("Report documents upload", startDate, middleDate, "", milestone.isOwnerView);
    } else if (stepNumber == 1) {
      return new VotingInProgressMilestoneStepData("Voting period", middleDate, endDate, "", milestone.isOwnerView, true, true, votingResults, onVoteCast);
    } else if (stepNumber == 2) {
      return new VotingResultsMilestoneStepData("Voting results", endDate!!, undefined, "", milestone.isOwnerView, votingResults);
    } else if (stepNumber == 3) {
      let stepName = "";
      let caption = "";
      if (votingResults.finalResult === undefined) {
        stepName = "Funding release/project cancellation";
        caption = `${milestone.tokensToRelease.toString()} tokens to release`;
      } else if (votingResults.finalResult) {
        stepName = "Funding release";
        caption = `${milestone.tokensToRelease.toString()} tokens released`;
      } else {
        stepName = "Project cancellation";
        caption = "Tokens returned to investors";
      }
      return new MilestoneStepData(stepName, endDate!!, undefined, caption, milestone.isOwnerView)
    } else {
      return new MilestoneStepData("DEFAULT", startDate, startDate, "", milestone.isOwnerView);
    }
  }

  function makeVotingResults(): VotingResult {
    return { forVotes: 0, againstVotes: 0, waitingVotes: 0,userVotedFor: true, finalResult: undefined };
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
              if (step instanceof VotingInProgressMilestoneStepData) {
                return <VotingInProgressStep step={step} />
              } else if (step instanceof VotingResultsMilestoneStepData) {
                return <VotingResultsStep step={step} />
              } else if (step instanceof DocumentUploadStepData) {
                return <DocumentUploadStep step={step} />
              }
            })}
          </Stepper>
        </CardContent>
      </Card>
    </>
  );
}

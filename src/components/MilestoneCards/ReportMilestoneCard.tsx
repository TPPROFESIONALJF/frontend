import { Milestone, ReportMilestoneProps } from "@/domain/Milestone";
import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { Card, CardContent, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { DocumentUploadStep } from "../Steps/DocumentUploadStep";
import { VotingInProgressStep } from "../Steps/VotingInProgressStep";
import { VotingResultsStep } from "../Steps/VotingResultsStep";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";
import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";
import { EndMilestoneStepData } from "@/domain/EndMilestoneStepData";
import { EndMilestoneStep } from "../Steps/EndMilestoneStep";
import { buildMilestoneSteps, getActiveStep } from "@/utils/stepsUtils";
import ContractAddresses from "@/contracts/ContractAddresses.json";
import { useContractRead, useContractWrite } from 'wagmi';
import { governorABI } from "@/contracts/Governor";
import { waitForTransaction, writeContract, prepareWriteContract, readContract } from '@wagmi/core';
import {enqueueSnackbar } from 'notistack';

const statuses = ["Pending",
  , "Active",
  , "Canceled",
  , "Defeated",
  , "Succeeded",
  , "Queued",
  , "Expired",
  , "Executed"];


export default statuses;

function getCardTitle(milestone: Milestone) {
  return milestone.endDate
    ? `${milestone.startDate.format('DD/MM/YYYY HH:mm:ss')} - ${milestone.endDate.format('DD/MM/YYYY HH:mm:ss')}`
    : `${milestone.startDate.format('DD/MM/YYYY HH:mm:ss')}`
}

async function onVoteCast(proposalId: bigint, voteFor: number) {
  try{
    const { request: voteConfig } = await prepareWriteContract({
      address: ContractAddresses.governorAddress as `0x${string}`,
      abi: governorABI,
      functionName: 'castVote',
      args: [
        proposalId,
        voteFor
      ]
    });

    const { hash: voteHash } = await writeContract(voteConfig);
    await waitForTransaction({ hash: voteHash });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      let errorMessage = "";
        if (error.message.includes("vote not currently active")){
          errorMessage = "Voting period has finished";
        }
        if (error.message.includes("unknown proposal id")){
          errorMessage = "Voting period has not started yet";
        }

      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }
}

export function ReportMilestoneCard({ milestone }: ReportMilestoneProps) {
  const steps = [
    buildMilestoneSteps(milestone, 0, onVoteCast, milestone.onDocumentsUpload),
    buildMilestoneSteps(milestone, 1, onVoteCast, milestone.onDocumentsUpload),
    buildMilestoneSteps(milestone, 2, onVoteCast, milestone.onDocumentsUpload),
    buildMilestoneSteps(milestone, 3, onVoteCast, milestone.onDocumentsUpload)
  ];

  const [activeStep, setActiveStep] = useState(getActiveStep(milestone, steps));

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

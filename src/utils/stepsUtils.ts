import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";
import { EndMilestoneStepData } from "@/domain/EndMilestoneStepData";
import { Milestone } from "@/domain/Milestone";
import { MilestoneStepData } from "@/domain/MilestoneStepData";
import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";
import dayjs from "dayjs";

export function getDates(step: MilestoneStepData) {
  return step.endDate
    ? `${step.startDate.format('DD/MM/YYYY')} - ${step.endDate.format('DD/MM/YYYY')}`
    : `${step.startDate.format('DD/MM/YYYY')}`
}

export function buildMilestoneSteps(milestone: Milestone, stepNumber: number, onVoteCast: (proposalId: bigint, voteFor: number) => void, onDocumentsUpload: () => void): MilestoneStepData {
  const startDate = milestone.startDate;
  const endDate = milestone.endDate;
  const diff = endDate?.diff(startDate, 'minute');
  const middleDate = endDate !== undefined ? startDate.add(diff!! / 2, "minute") : startDate;
  if (stepNumber == 0) {
    console.log("step number 0");
    console.log(milestone.isOwnerView);
    return new DocumentUploadStepData("Report documents upload", startDate, middleDate, "", milestone.isOwnerView, onDocumentsUpload, "");
  } else if (stepNumber == 1) {
    console.log("step number 1");
    return new VotingInProgressMilestoneStepData("Voting period", middleDate, endDate, "", milestone.isOwnerView, false, true, milestone.votingResults, onVoteCast);
  } else if (stepNumber == 2) {
    console.log("step number 2");
    return new VotingResultsMilestoneStepData("Voting results", endDate!!, undefined, "", milestone.isOwnerView, milestone.votingResults);
  } else if (stepNumber == 3) {
    console.log("step number 3");
    let stepName = "";
    let caption = "";
    if (milestone?.votingResults?.finalResult === undefined) {
      stepName = "Funding release/project cancellation";
      caption = `${milestone.tokensToRelease.toString()} tokens to release`;
    } else if (milestone.votingResults.finalResult) {
      stepName = "Funding release";
      caption = `${milestone.tokensToRelease.toString()} tokens released`;
    } else {
      stepName = "Project cancellation";
      caption = "Tokens returned to investors";
    }
    return new EndMilestoneStepData(stepName, endDate!!, undefined, caption, milestone.isOwnerView)
  } else {
    return new MilestoneStepData("DEFAULT", startDate, startDate, "", milestone.isOwnerView);
  }
}

export function getActiveStep(milestone: Milestone, steps: MilestoneStepData[]): number {
  const now = dayjs();
  let lastIndexBeforeNow = steps.findLastIndex((step) => step.endDate?.isBefore(now));
  if (milestone.startDate.isAfter(now)) {
    console.log("getActiveStep is -1");
    return 2;
  } else if (milestone.endDate?.isBefore(now)) {
    console.log("getActiveStep is milestone.endDate?.isBefore(now)")
    return steps.length + 1;
  } else if (lastIndexBeforeNow >= 0) {
    console.log("getActiveStep lastIndexBeforeNow >= 0")
    return lastIndexBeforeNow;
  } else {
    console.log("getActiveStep else")
    return 0;
  }
  console.log("getActiveStep base on date")
  return milestone.startDate.isAfter(now) ? -1
    : milestone.endDate?.isBefore(now) ? steps.length + 1
    : steps.findLastIndex((step) => step.endDate?.isBefore(now));
}

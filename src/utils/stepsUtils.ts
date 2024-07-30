import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";
import { EndMilestoneStepData } from "@/domain/EndMilestoneStepData";
import { Milestone, ReportMilestone } from "@/domain/Milestone";
import { MilestoneStepData } from "@/domain/MilestoneStepData";
import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";
import dayjs from "dayjs";

export function getDates(step: MilestoneStepData) {
  return step.endDate
    ? `${step.startDate.format('DD/MM/YYYY HH:mm:ss')} - ${step.endDate.format('DD/MM/YYYY HH:mm:ss')}`
    : `${step.startDate.format('DD/MM/YYYY HH:mm:ss')}`
}

export function buildMilestoneSteps(milestone: Milestone, stepNumber: number, onVoteCast: (proposalId: bigint, voteFor: number) => void, onDocumentsUpload: (file: File) => boolean): MilestoneStepData {
  const startDate = milestone.startDate;
  const endDate = milestone.endDate;
  const diff = endDate?.diff(startDate, 'minute');
//  const middleDate = endDate !== undefined ? startDate.add(diff!! / 2, "minute") : startDate;
  const middleDate = endDate !== undefined ? startDate.add(1, "minute") : startDate; // For demo purposes we give more time to votations
  if (stepNumber == 0) {
    let documentMilestone = milestone as ReportMilestone;
    return new DocumentUploadStepData("Report documents upload", startDate, middleDate, "", milestone.isOwnerView, onDocumentsUpload, "", documentMilestone.documentName, documentMilestone.documentUrl);
  } else if (stepNumber == 1) {
    return new VotingInProgressMilestoneStepData("Voting period", middleDate, endDate, "", milestone.isOwnerView, false, true, milestone.votingResults, onVoteCast);
  } else if (stepNumber == 2) {
    return new VotingResultsMilestoneStepData("Voting results", endDate!!, undefined, "", milestone.isOwnerView, milestone.votingResults);
  } else if (stepNumber == 3) {
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
  if (!milestone.isActive) {
    return -1;
  }
  const now = dayjs();
  let lastStepBeforeNow = steps.findLastIndex((step) => step.startDate.isBefore(now) && step.endDate?.isAfter(now));
  if (milestone.startDate.isAfter(now)) {
    return -1;
  } else if (milestone.endDate?.isBefore(now)) {
    let step = steps.length + 1;
    return steps.length + 1;
  } else if (lastStepBeforeNow >= 0) {
    return lastStepBeforeNow;
  } else {
    return 99;
  }
}

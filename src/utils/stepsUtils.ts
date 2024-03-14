import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";
import { EndMilestoneStepData } from "@/domain/EndMilestoneStepData";
import { Milestone } from "@/domain/Milestone";
import { MilestoneStepData } from "@/domain/MilestoneStepData";
import { VotingInProgressMilestoneStepData } from "@/domain/VotingInProgressMilestoneStepData";
import { VotingResultsMilestoneStepData } from "@/domain/VotingResultsMilestoneStepData";

export function getDates(step: MilestoneStepData) {
  return step.endDate
    ? `${step.startDate.format('DD/MM/YYYY')} - ${step.endDate.format('DD/MM/YYYY')}`
    : `${step.startDate.format('DD/MM/YYYY')}`
}

export function buildMilestoneSteps(milestone: Milestone, stepNumber: number, onVoteCast: (voteFor: boolean) => void): MilestoneStepData {
  const startDate = milestone.startDate;
  const endDate = milestone.endDate;
  const diff = endDate?.diff(startDate, 'minute');
  const middleDate = endDate !== undefined ? startDate.add(diff!! / 2, "minute") : startDate;
  if (stepNumber == 0) {
    return new DocumentUploadStepData("Report documents upload", startDate, middleDate, "", milestone.isOwnerView);
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
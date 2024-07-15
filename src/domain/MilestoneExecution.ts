export interface MilestoneExecution {
  projectId: bigint;
  proposalId: bigint;
  startDate: bigint;
  endDate: bigint;
  stage: number;
}

import { Dayjs } from "dayjs";
import { VotingResult } from "./VotingResult";

export interface Milestone {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  tokensToRelease: bigint;
  activeStep: number;
  isOwnerView: boolean;
  votingResults: VotingResult | undefined;
}

export interface MilestoneProps {
  milestone: Milestone;
}

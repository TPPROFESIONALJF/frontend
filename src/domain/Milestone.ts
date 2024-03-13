import { Dayjs } from "dayjs";
import { VotingResult } from "./VotingResult";

export class Milestone {
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  tokensToRelease: bigint;
  activeStep: number;
  isOwnerView: boolean;

  constructor(
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _tokensToRelease: bigint,
    _activeStep: number,
    _isOwnerView: boolean
  ) {
    this.startDate = _startDate;
    this.endDate = _endDate;
    this.tokensToRelease = _tokensToRelease;
    this.activeStep = _activeStep;
    this.isOwnerView = _isOwnerView;
  }
}

export class EndMilestone extends Milestone { }

export class StartMilestone extends Milestone { }

export interface MilestoneProps {
  milestone: Milestone;
}

export interface ReportMilestoneProps {
  milestone: ReportMilestone;
}

export class ReportMilestone extends Milestone {
  votingResults: VotingResult | undefined;

  constructor(
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _tokensToRelease: bigint,
    _activeStep: number,
    _isOwnerView: boolean,
    _votingResults: VotingResult | undefined
  ) {
    super(_startDate, _endDate, _tokensToRelease, _activeStep, _isOwnerView);
    this.votingResults = _votingResults;
  }
}

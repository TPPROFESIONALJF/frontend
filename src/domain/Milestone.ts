import { Dayjs } from "dayjs";
import { VotingResult } from "./VotingResult";

export class Milestone {
  projectId: bigint;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  tokensToRelease: bigint;
  activeStep: number;
  isOwnerView: boolean;

  constructor(
    _projectId: bigint,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _tokensToRelease: bigint,
    _activeStep: number,
    _isOwnerView: boolean
  ) {
    this.projectId = _projectId;
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
  onDocumentsUpload: () => void;
  votingResults: VotingResult | undefined;
  proposalId: bigint;

  constructor(
    _projectId: bigint,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _tokensToRelease: bigint,
    _activeStep: number,
    _isOwnerView: boolean,
    _votingResults: VotingResult | undefined,
    _onDocumentsUpload: () => void,
    _proposalId: bigint
  ) {
    super(_projectId, _startDate, _endDate, _tokensToRelease, _activeStep, _isOwnerView);
    this.votingResults = _votingResults;
    this.onDocumentsUpload = _onDocumentsUpload;
    this.proposalId = _proposalId;
  }
}

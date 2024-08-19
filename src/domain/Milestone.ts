import { Dayjs } from "dayjs";
import { VotingResult } from "./VotingResult";
import { MilestoneStage } from "@/utils/projectsUtils";

export class Milestone {
  projectId: bigint;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  tokensToRelease: bigint;
  isOwnerView: boolean;
  isActive: boolean;
  stage: MilestoneStage;

  constructor(
    _projectId: bigint,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _tokensToRelease: bigint,
    _isOwnerView: boolean,
    _isActive: boolean,
    _stage: number
  ) {
    this.projectId = _projectId;
    this.startDate = _startDate;
    this.endDate = _endDate;
    this.tokensToRelease = _tokensToRelease;
    this.isOwnerView = _isOwnerView;
    this.isActive = _isActive;
    this.stage = _stage;
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
  onDocumentsUpload: (file: File) => boolean;
  votingResults: VotingResult | undefined;
  proposalId: bigint;
  documentName: string | undefined;
  documentUrl: string | undefined;

  constructor(
    _projectId: bigint,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _tokensToRelease: bigint,
    _isOwnerView: boolean,
    _isActive: boolean,
    _stage: number,
    _votingResults: VotingResult | undefined,
    _onDocumentsUpload: (file: File) => boolean,
    _proposalId: bigint,
    _documentName: string | undefined,
    _documentUrl: string | undefined
  ) {
    super(_projectId, _startDate, _endDate, _tokensToRelease, _isOwnerView, _isActive, _stage);
    this.votingResults = _votingResults;
    this.onDocumentsUpload = _onDocumentsUpload;
    this.proposalId = _proposalId;
    this.documentName = _documentName;
    this.documentUrl = _documentUrl;
  }
}

import { Dayjs } from "dayjs";
import { MilestoneStepData } from "./MilestoneStepData";
import { VotingResult } from "./VotingResult";

export class VotingInProgressMilestoneStepData extends MilestoneStepData {
  isVotationOpen: boolean;
  alreadyVoted: boolean;
  // Will be called with true if voting for and false if voting against
  onVoteCast: (voteFor: boolean) => void;
  voteResults: VotingResult | undefined;

  constructor(
    _name: string,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _caption: string,
    _isOwnerView: boolean,
    _alreadyVoted: boolean,
    _isVotationOpen: boolean,
    _voteResults: VotingResult | undefined,
    _onVoteCast: (voteFor: boolean) => void) {
    super(_name, _startDate, _endDate, _caption, _isOwnerView);
    this.alreadyVoted = _alreadyVoted;
    this.isVotationOpen = _isVotationOpen;
    this.voteResults = _voteResults;
    this.onVoteCast = _onVoteCast;
  }
}

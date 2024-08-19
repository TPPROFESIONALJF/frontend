import { Dayjs } from "dayjs";
import { VotingResult } from "./VotingResult";
import { MilestoneStepData } from "./MilestoneStepData";

export class VotingResultsMilestoneStepData extends MilestoneStepData {
  voteResults: VotingResult | undefined;

  constructor(
    _name: string,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _caption: string,
    _isOwnerView: boolean,
    _voteResults: VotingResult | undefined) {
    super(_name, _startDate, _endDate, _caption, _isOwnerView);
    this.voteResults = _voteResults;
  }
}

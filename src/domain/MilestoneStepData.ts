import { Dayjs } from "dayjs";

export class MilestoneStepData {
  name: string;
  startDate: Dayjs;
  endDate: Dayjs | undefined;
  caption: string;
  isOwnerView: boolean;

  constructor(_name: string, _startDate: Dayjs, _endDate: Dayjs | undefined, _caption: string, _isOwnerView: boolean) {
    this.name = _name;
    this.startDate = _startDate;
    this.endDate = _endDate;
    this.caption = _caption;
    this.isOwnerView = _isOwnerView;
  }
}

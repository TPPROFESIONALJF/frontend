import { Dayjs } from "dayjs";
import { MilestoneStepData } from "./MilestoneStepData"

export class DocumentUploadStepData extends MilestoneStepData {
  onDocumentsUpload: () => void;
  proposalStatus: String

  constructor(
    _name: string,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _caption: string,
    _isOwnerView: boolean,
    _onDocumentsUpload: () => void,
    _proposalStatus: String
  ) {
    super(_name, _startDate, _endDate, _caption, _isOwnerView);
    this.onDocumentsUpload = _onDocumentsUpload;
    this.proposalStatus = _proposalStatus
  }
}

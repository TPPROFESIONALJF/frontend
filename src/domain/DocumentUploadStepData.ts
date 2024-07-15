import { Dayjs } from "dayjs";
import { MilestoneStepData } from "./MilestoneStepData"

export class DocumentUploadStepData extends MilestoneStepData {
  onDocumentsUpload: () => void;

  constructor(
    _name: string,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _caption: string,
    _isOwnerView: boolean,
    _onDocumentsUpload: () => void
  ) {
    super(_name, _startDate, _endDate, _caption, _isOwnerView);
    this.onDocumentsUpload = _onDocumentsUpload;
  }
}

import { Dayjs } from "dayjs";
import { MilestoneStepData } from "./MilestoneStepData"

export class DocumentUploadStepData extends MilestoneStepData {
  onDocumentsUpload: (file: File) => Promise<boolean>;
  proposalStatus: String;
  documentName: String | undefined;
  documentUrl: string | undefined;

  constructor(
    _name: string,
    _startDate: Dayjs,
    _endDate: Dayjs | undefined,
    _caption: string,
    _isOwnerView: boolean,
    _onDocumentsUpload: (file: File) => Promise<boolean>,
    _proposalStatus: String,
    _documentName: string | undefined,
    _documentUrl: string | undefined
  ) {
    super(_name, _startDate, _endDate, _caption, _isOwnerView);
    this.onDocumentsUpload = _onDocumentsUpload;
    this.proposalStatus = _proposalStatus;
    this.documentName = _documentName;
    this.documentUrl = _documentUrl;
  }
}

import { getDates } from "@/utils/stepsUtils";
import { Button, Step, StepContent, StepLabel, Typography } from "@mui/material";
import { useState } from "react";
import UploadDocumentsModal from "../UploadDocumentsModal";
import { DocumentUploadStepData } from "@/domain/DocumentUploadStepData";

interface DocumentUploadStepProps {
  step: DocumentUploadStepData;
}

export function DocumentUploadStep({ step, ...other }: DocumentUploadStepProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const stepProps: { completed?: boolean } = {};
  const labelProps: {
    optional?: React.ReactNode;
  } = {};
  labelProps.optional = <Typography variant="body2">{step?.caption}</Typography>

  return (
    <Step key={step!!.name} {...stepProps} {...other}>
      <StepLabel {...labelProps}>({getDates(step)}) {step.name}</StepLabel>
      <StepContent>
        {
          step.isOwnerView ? <Button onClick={handleOpen}>Upload documents</Button> : ""
        }
        { step.documentName != undefined ? <Button href={step.documentUrl!!} download={step.documentName}>Download document</Button> : "" }
        <UploadDocumentsModal props={{
          open,
          handleClose,
          async onUploadClick(file) {
            if (await step.onDocumentsUpload(file)) {
              handleClose();
            }
          }
        }} />
      </StepContent>
    </Step>
  );
}

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Stack, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import UploadField from './UploadField';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "35%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

interface UploadDocumentsModalProps {
  props: {
    open: boolean;
    handleClose: (() => void);
    onUploadClick: (file: File) => void;
  }
}

export default function UploadDocumentsModal({ props }: UploadDocumentsModalProps) {
  
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  function onUpload() {
    if (file != undefined) {
      props.onUploadClick(file);
    }
  }

  function onClose() {
    props.handleClose();
  }

  return (
    <div>
      <Modal
        open={props?.open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{pb: 2}}>
            Upload documents and info that demonstrates the project advancements
          </Typography>
          <UploadField fileName={fileName} label="Project documentation" onFileChange={handleFileChange} />
          <Stack spacing={1} sx={{ pt: 2 }}>
            <Button onClick={onUpload} size='large' variant="contained" fullWidth>Upload</Button>
            <Button onClick={onClose} size='large' variant="text" fullWidth>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
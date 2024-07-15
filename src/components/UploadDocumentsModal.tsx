import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

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
    onUploadClick: (() => void);
  }
}

export default function UploadDocumentsModal({ props }: UploadDocumentsModalProps) {
  function onUpload() {
    props.onUploadClick();
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload documents and info that demonstrates the project advancements
          </Typography>
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
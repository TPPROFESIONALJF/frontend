import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';

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

interface InvestModalProps {
  props: {
    open: boolean;
    handleClose: (() => void);
    onInvestClick: (() => void);
    investAmount: number;
    setInvestAmount: ((value: number) => void);
  }
}

export default function InvestModal({ props }: InvestModalProps) {
  function onInvest() {
    if (props.investAmount <= 0 || !Number.isInteger(props.investAmount)) {
      alert("Please set an investment value greater than 0 without decimals");
      return;
    }
    props.onInvestClick();
  }

  function onClose() {
    props.setInvestAmount(0);
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
            How much tokens you want to invest?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              type="number"
              label="Investment"
              variant="outlined"
              onChange={(e) => props.setInvestAmount(parseFloat(e.target.value))}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">TOKENS</InputAdornment>,
              }}
              fullWidth={true}
              required
            />
          </Typography>
          <Stack spacing={1} sx={{ pt: 2 }}>
            <Button onClick={onInvest} size='large' variant="contained" fullWidth>Invest</Button>
            <Button onClick={onClose} size='large' variant="text" fullWidth>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
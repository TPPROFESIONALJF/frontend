// components/UploadField.tsx
import { ChangeEvent } from 'react';
import { TextField, Button, InputAdornment } from '@mui/material';

interface UploadFieldProps {
  fileName: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UploadField: React.FC<UploadFieldProps> = ({ fileName, onFileChange }) => {
  return (
    <TextField
      variant="outlined"
      label="Upload File"
      value={fileName}
      fullWidth
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <label htmlFor="file-input">
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
              <Button component="span">Browse</Button>
            </label>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default UploadField;
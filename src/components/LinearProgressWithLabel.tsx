import { Stack, Box, LinearProgress, LinearProgressProps, Typography } from "@mui/material";

export default function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Stack direction="column">
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box>
    </Stack>
  );
}

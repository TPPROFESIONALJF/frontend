import { Box, Typography } from "@mui/material"

export default function NotFound() {
  return (
    <Box className='mainContainer'>
      <Typography
        component="h1"
        variant="h1"
        fontWeight="fontWeightBold"
        gutterBottom
      >404 - Project Not Found</Typography>
    </Box>
  );
}
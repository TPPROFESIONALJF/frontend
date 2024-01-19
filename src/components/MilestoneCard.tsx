import { Card, CardContent, Typography } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';

interface MilestoneProps {
  milestone: {
    name: string;
    startDate: Dayjs;
    endDate: Dayjs | undefined;
  }
}

export default function MilestoneCard({ milestone }: MilestoneProps) {

  function getName() {
    milestone.name
  }

  function getDates() {
    return milestone.endDate
      ? `(${milestone.startDate.format('DD/MM/YYYY')} - ${milestone.endDate.format('DD/MM/YYYY')})`
      : `(${milestone.startDate.format('DD/MM/YYYY')})`
  }

  return (
    <>
      <Card variant="outlined"
        sx={{
          height: "100%",
          borderRadius: 2,
          backgroundColor: 'background.default',
          borderColor: 'primary.main'
        }}>
        <CardContent>
          <Typography
            component="h1"
            variant="h5"
            fontWeight="fontWeightBold"
          >
            {milestone.name}
          </Typography>
          <Typography
            component="h1"
            variant="subtitle1"
            color="gray"
            gutterBottom
          >
            {getDates()}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

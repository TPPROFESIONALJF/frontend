import { Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { getDates } from "@/utils/stepsUtils";
import { MilestoneStepData } from "@/domain/MilestoneStepData";
import { MilestoneProps } from "@/domain/Milestone";
import dayjs from "dayjs";

export function EndMilestoneCard({ milestone }: MilestoneProps) {
  const [activeStep, setActiveStep] = useState(milestone.activeStep);

  const steps = [
    new MilestoneStepData(
      "Project revenues presentation",
      milestone.startDate,
      milestone.endDate,
      "",
      milestone.isOwnerView
    ),
    new MilestoneStepData(
      "Revenues release to investors",
      milestone.endDate!!,
      undefined,
      "Tokens to release are based on initial investment",
      milestone.isOwnerView
    )
  ];

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
            Project End
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="gray"
            fontWeight="fontWeightBold"
            gutterBottom
          >
            {getDates(steps[0])}
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              labelProps.optional =
                <Typography variant="body2">{step.caption}</Typography>;
              return (
                <Step key={step?.name} {...stepProps}>
                  <StepLabel {...labelProps}>({getDates(step)}) {step?.name}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>
    </>
  );
}

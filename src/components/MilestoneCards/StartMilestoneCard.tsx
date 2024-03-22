import { Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { getActiveStep, getDates } from "@/utils/stepsUtils";
import { MilestoneStepData } from "@/domain/MilestoneStepData";
import { MilestoneProps } from "@/domain/Milestone";

export function StartMilestoneCard({ milestone }: MilestoneProps) {

  const steps = [
    new MilestoneStepData(
      "Funding release",
      milestone.startDate,
      undefined,
      milestone.tokensToRelease.toString(),
      milestone.isOwnerView
    )
  ];

  const [activeStep, setActiveStep] = useState(getActiveStep(milestone, steps));

  steps[0].caption += (activeStep <= 0) ? " tokens to release" : " tokens released";

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
            Project Start
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

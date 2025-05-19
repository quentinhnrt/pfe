import { StepType } from "@/features/on-boarding/types";
import { CheckIcon } from "lucide-react";

interface StepIndicatorProps {
  steps: StepType[];
  currentStep: number;
  goToStep: (step: number) => void;
  validSteps?: number[];
}

export function StepIndicator({
  steps,
  currentStep,
  goToStep,
  validSteps = [],
}: StepIndicatorProps) {
  const isStepValid = (stepIndex: number) => validSteps.includes(stepIndex);

  return (
    <div className="mb-0">
      <div className="flex justify-between items-start w-full mb-6">
        {steps.map((step, index) => {
          const isValid = isStepValid(index);
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;
          const isFuture = index > currentStep;

          return (
            <button
              key={index}
              onClick={() => index <= currentStep && goToStep(index)}
              className="flex flex-col items-center text-center w-1/4 group"
              disabled={isFuture}
              aria-current={isCurrent ? "step" : undefined}
              type="button"
            >
              <div
                className={`
                  flex items-center justify-center rounded-full w-12 h-12 mb-2
                  transition-colors duration-200
                  ${
                    isValid
                      ? "bg-green-600 text-white"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isPast
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                  }
                  ${!isFuture ? "cursor-pointer" : "cursor-not-allowed"}
                `}
                aria-hidden="true"
              >
                {isValid ? <CheckIcon className="w-6 h-6" /> : step.icon}
              </div>
              <span
                className={`font-medium text-xs mt-2 ${
                  isValid
                    ? "text-green-600"
                    : isCurrent
                      ? "text-primary font-semibold"
                      : isPast
                        ? "text-primary/70"
                        : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
        <p className="text-sm">{steps[currentStep].description}</p>
      </div>
    </div>
  );
}

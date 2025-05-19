import { Button } from "@/components/ui/button";
import { StepType } from "@/features/on-boarding/types";
import { ArrowLeftIcon, ArrowRightIcon, UserIcon } from "lucide-react";

interface NavButtonsProps {
  currentStep: number;
  steps: StepType[];
  goToPreviousStep: () => void;
  validateAndProceed: () => void;
  isLoading: boolean;
}

export function NavButtons({
  currentStep,
  steps,
  goToPreviousStep,
  validateAndProceed,
  isLoading,
}: NavButtonsProps) {
  const isLastStep = currentStep === steps.length - 1;

  const renderNextButtonContent = () => {
    if (!isLastStep) {
      return (
        <>
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
          Loading...
        </>
      );
    }

    return (
      <>
        <UserIcon className="h-4 w-4" />
        Finish
      </>
    );
  };

  return (
    <div className="flex justify-between pt-6 mt-10 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={goToPreviousStep}
        disabled={currentStep === 0}
        className="min-w-[100px]"
        aria-label="Go to previous step"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Previous
      </Button>

      <Button
        type="button"
        onClick={validateAndProceed}
        className="min-w-[100px]"
        aria-label={isLastStep ? "Finish form" : "Go to next step"}
      >
        {renderNextButtonContent()}
      </Button>
    </div>
  );
}

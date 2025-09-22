import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface RegistrationNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export function RegistrationNavigation({
  currentStep,
  totalSteps,
  isLoading,
  onPrevStep,
  onNextStep,
}: RegistrationNavigationProps) {
  return (
    <div className="border-t bg-white px-6 py-3 flex-shrink-0">
      {/* Navigation buttons */}
      {currentStep < totalSteps && (
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevStep}
            disabled={currentStep === 1}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            type="button"
            onClick={onNextStep}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
      
      
       
      
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface RegistrationNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSwitchToLogin: () => void;
}

export function RegistrationNavigation({
  currentStep,
  totalSteps,
  isLoading,
  onPrevStep,
  onNextStep,
  onSwitchToLogin,
}: RegistrationNavigationProps) {
  return (
    <div className="border-t bg-white p-6 flex-shrink-0">
      {/* Navigation buttons */}
      {currentStep < totalSteps && (
        <div className="flex justify-between mb-4">
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
      
      {/* Login link */}
      {currentStep === 1 && (
        <div className="text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            className="text-[#007a7f] hover:underline cursor-pointer"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
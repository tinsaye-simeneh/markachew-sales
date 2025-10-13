import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Clock } from 'lucide-react';

interface Step3Props {
  email: string;
  otp: string;
  timeLeft: number;
  otpError: string;
  isVerifying: boolean;
  isRequestingOTP: boolean;
  otpRequested: boolean;
  otpMessage: string;
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOTPSubmit: (e: React.FormEvent) => void;
  handleResendOTP: () => void;
}

export function Step3({
  email,
  otp,
  timeLeft,
  otpError,
  isVerifying,
  isRequestingOTP,
  otpRequested,
  otpMessage,
  handleOtpChange,
  handleOTPSubmit,
  handleResendOTP,
}: Step3Props) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification code to
        </CardDescription>
            <div className="font-medium text-primary">{email}</div>
      </CardHeader>
      
      <CardContent className='mt-4'>
        <form onSubmit={handleOTPSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={handleOtpChange}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
            <div className={`text-center text-sm ${timeLeft > 0 ? 'text-gray-500' : 'text-red-500'}`}>
              <Clock className="h-4 w-4 inline mr-1" />
              {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code has expired'}
            </div>
          </div>

          {otpRequested && (
            <div className={`border rounded-lg p-3 ${
              otpMessage.toLowerCase().includes('existing') 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                otpMessage.toLowerCase().includes('existing') 
                  ? 'text-blue-800' 
                  : 'text-green-800'
              }`}>
                {otpMessage.toLowerCase().includes('existing') ? 'Existing OTP' : 'OTP Sent'}
              </div>
              <div className={`text-sm ${
                otpMessage.toLowerCase().includes('existing') 
                  ? 'text-blue-600' 
                  : 'text-green-600'
              }`}>
                {otpMessage.toLowerCase().includes('existing') 
                  ? 'You already have a valid verification code. Please use it to continue.'
                  : 'Verification code has been sent to your email'
                }
              </div>
            </div>
          )}
          
          {otpError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {otpError}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full cursor-pointer" 
            disabled={isVerifying || otp.length !== 6 || timeLeft === 0}
          >
            {isVerifying ? 'Verifying...' : timeLeft === 0 ? 'Code Expired' : 'Complete Registration'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          {timeLeft === 0 ? (
            <div className="space-y-2">
              <div className="text-sm text-red-600 font-medium">Code has expired</div>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isRequestingOTP}
                className="text-sm text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isRequestingOTP ? 'Sending...' : 'Resend New Code'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isRequestingOTP || timeLeft !== 0}
              className="text-sm text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequestingOTP ? 'Sending...' : "Didn't receive the code? Resend"}
            </button>
          )}
        </div>
      </CardContent>
    </>
  );
}
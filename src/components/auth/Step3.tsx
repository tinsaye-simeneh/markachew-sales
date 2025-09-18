import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Clock } from 'lucide-react';

interface Step3Props {
  email: string;
  otp: string;
  timeLeft: number;
  STATIC_OTP: string;
  otpError: string;
  isVerifying: boolean;
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOTPSubmit: (e: React.FormEvent) => void;
}

export function Step3({
  email,
  otp,
  timeLeft,
  STATIC_OTP,
  otpError,
  isVerifying,
  handleOtpChange,
  handleOTPSubmit,
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
          We&apos;ve sent a 6-digit verification code to
        </CardDescription>
        <div className="font-medium text-[#007a7f]">{email}</div>
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
            <div className="text-center text-sm text-gray-500">
              <Clock className="h-4 w-4 inline mr-1" />
              Code expires in {formatTime(timeLeft)}
            </div>
          </div>

          {/* Demo OTP Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800 font-medium mb-1">Demo Mode</div>
            <div className="text-sm text-blue-600">
              Use this code: <span className="font-mono font-bold">{STATIC_OTP}</span>
            </div>
          </div>
          
          {otpError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {otpError}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full cursor-pointer" 
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? 'Verifying...' : 'Complete Registration'}
          </Button>
        </form>
      </CardContent>
    </>
  );
}
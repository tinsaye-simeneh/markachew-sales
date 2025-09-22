"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, Clock } from 'lucide-react'

interface OTPVerificationProps {
  email: string
  onBack: () => void
  onComplete: () => void
}

export function OTPVerification({ email, onBack, onComplete }: OTPVerificationProps) {
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Static OTP for demo purposes
  const STATIC_OTP = '123456'

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsVerifying(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (otp === STATIC_OTP) {
      // Success - redirect to sign in
      onComplete()
    } else {
      setError('Invalid OTP. Please try again.')
    }
    
    setIsVerifying(false)
  }

  const handleResend = () => {
    setTimeLeft(300) // Reset timer
    setError('')
    setOtp('')
    // In a real app, this would trigger a new OTP to be sent
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
      setError('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-2 top-2 z-10 cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit verification code to
          </CardDescription>
            <div className="font-medium text-primary">{email}</div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full cursor-pointer" 
              disabled={isVerifying || otp.length !== 6 || timeLeft === 0}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              Didn&apos;t receive the code?
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleResend}
              disabled={timeLeft > 0}
            >
              {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
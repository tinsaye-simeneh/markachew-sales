"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { X, Mail, Clock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'employee' | 'employer' | 'buyer' | 'seller'>('buyer')
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [timeLeft] = useState(300) // 5 minutes
  const [otpError, setOtpError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const {  completeRegistration, isLoading } = useAuth()
  const router = useRouter()

  // Static OTP for demo
  const STATIC_OTP = '123456'

  const validatePhoneNumber = (phone: string): boolean => {
    // Ethiopian phone number validation
    // Format: 09xxxxxxxx (10 digits starting with 09) or +2519xxxxxxxx (international format)
    const ethiopianPhoneRegex = /^(\+2519\d{8}|09\d{8})$/
    return ethiopianPhoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate required fields
    if (!name.trim()) {
      setError('Full name is required')
      return
    }
    
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    
    if (!password) {
      setError('Password is required')
      return
    }
    
    if (!confirmPassword) {
      setError('Please confirm your password')
      return
    }

    // Validate phone number format if provided
    if (phone && !validatePhoneNumber(phone)) {
      setError('Please enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Simulate registration and show OTP
    setShowOTP(true)
    setError('')
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    setIsVerifying(true)

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (otp === STATIC_OTP) {
      // Complete registration
      completeRegistration(name, email, userType)
      
      // Reset form and close modal
      setName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setConfirmPassword('')
      setUserType('buyer')
      setShowOTP(false)
      setOtp('')
      onClose()
      
      // Redirect to home page
      router.push('/')
    } else {
      setOtpError('Invalid OTP. Please try again.')
    }
    
    setIsVerifying(false)
  }

  const handleOTPBack = () => {
    setShowOTP(false)
    setOtp('')
    setOtpError('')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
      setOtpError('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 z-10 cursor-pointer"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {!showOTP ? (
          <>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Join our platform to find your dream home or job
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09xxxxxxxx or +2519xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userType">Account Type</Label>
                  <Select value={userType} onValueChange={(value: 'employee' | 'employer' | 'buyer' | 'seller') => setUserType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">House Buyer</SelectItem>
                      <SelectItem value="seller">House Seller</SelectItem>
                      <SelectItem value="employee">Job Seeker</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-[#007a7f] hover:underline cursor-pointer"
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-2 z-10 cursor-pointer"
              onClick={handleOTPBack}
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
              <div className="font-medium text-[#007a7f]">{email}</div>
            </CardHeader>
            
            <CardContent>
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
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
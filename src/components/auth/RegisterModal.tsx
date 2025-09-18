"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { UserType, CreateProfileRequest } from '@/lib/api'
import { X, Mail, Clock, ArrowLeft, ArrowRight, User, MapPin, Briefcase, FileText, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Step 1: Basic user information
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<UserType>(UserType.BUYER)

  // Step 2: Profile information
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')
  const [degree, setDegree] = useState('')
  const [department, setDepartment] = useState('')
  const [experience, setExperience] = useState('')
  const [availability, setAvailability] = useState<'FULL_TIME' | 'PART_TIME' | 'CONTRACT'>('FULL_TIME')
  const [salaryExpectation, setSalaryExpectation] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [document, setDocument] = useState<File | null>(null)
  const [license, setLicense] = useState<File | null>(null)

  // Step 3: Email verification
  const [otp, setOtp] = useState('')
  const [timeLeft] = useState(300) // 5 minutes

  // Error and loading states
  const [error, setError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const { register, completeRegistration, isLoading, error: authError } = useAuth()
  const router = useRouter()

  // Static OTP for demo
  const STATIC_OTP = '123456'

  const validatePhoneNumber = (phone: string): boolean => {
    // Ethiopian phone number validation
    // Format: 09xxxxxxxx (10 digits starting with 09) or +2519xxxxxxxx (international format)
    const ethiopianPhoneRegex = /^(\+2519\d{8}|09\d{8})$/
    return ethiopianPhoneRegex.test(phone)
  }

  // Step validation functions
  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      setError('Full name is required')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!password) {
      setError('Password is required')
      return false
    }
    if (!confirmPassword) {
      setError('Please confirm your password')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (phone && !validatePhoneNumber(phone)) {
      setError('Please enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)')
      return false
    }
    return true
  }

  const validateStep2 = (): boolean => {
    if (!location.trim()) {
      setError('Location is required')
      return false
    }
    if (!address.trim()) {
      setError('Address is required')
      return false
    }
    
    // Employee-specific validation
    if (userType === UserType.EMPLOYEE) {
      if (!degree.trim()) {
        setError('Degree/Education is required for employees')
        return false
      }
      if (!department.trim()) {
        setError('Department is required for employees')
        return false
      }
      if (experience && isNaN(Number(experience))) {
        setError('Experience must be a valid number')
        return false
      }
      if (salaryExpectation && isNaN(Number(salaryExpectation))) {
        setError('Salary expectation must be a valid number')
        return false
      }
    }
    
    return true
  }

  // Step navigation
  const nextStep = () => {
    setError('')
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const prevStep = () => {
    setError('')
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Reset form
  const resetForm = () => {
    setCurrentStep(1)
    setName('')
    setEmail('')
    setPhone('')
    setPassword('')
    setConfirmPassword('')
    setUserType(UserType.BUYER)
    setLocation('')
    setAddress('')
    setDegree('')
    setDepartment('')
    setExperience('')
    setAvailability('FULL_TIME')
    setSalaryExpectation('')
    setPhoto(null)
    setDocument(null)
    setLicense(null)
    setOtp('')
    setError('')
    setOtpError('')
  }

  const handleFinalSubmit = async () => {
    setError('')
    
    // Register user with API
    const success = await register(name, email, phone, password, userType)
    if (success) {
      // User registration successful, now create profile
      try {
        // Get the user ID from the registered user
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        
        // Create profile data
        const profileData: CreateProfileRequest = {
          user_id: user.id,
          location,
          address,
          degree: userType === UserType.EMPLOYEE ? degree : undefined,
          department: userType === UserType.EMPLOYEE ? department : undefined,
          experience: userType === UserType.EMPLOYEE && experience ? Number(experience) : undefined,
          availability: userType === UserType.EMPLOYEE ? availability : undefined,
          salary_expectation: userType === UserType.EMPLOYEE && salaryExpectation ? Number(salaryExpectation) : undefined,
          photo: photo ? photo : undefined,
          document: document ? document : undefined,
          license: license ? license : undefined,
        }
        
        // Profile creation will be handled by the profile page
        onClose()
        resetForm()
        router.push('/profile')
      } catch (error) {
        console.error('Profile creation error:', error)
        setError('Registration successful, but profile creation failed. Please complete your profile manually.')
      }
    } else {
      setError(authError || 'Registration failed')
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    setIsVerifying(true)

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (otp === STATIC_OTP) {
      // Complete registration and create profile
      await handleFinalSubmit()
    } else {
      setOtpError('Invalid OTP. Please try again.')
    }
    
    setIsVerifying(false)
  }

  // File upload handlers
  const handleFileUpload = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setter(file)
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

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 <= currentStep
                ? 'bg-[#007a7f] text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-2 ${
                i + 1 < currentStep ? 'bg-[#007a7f]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  // Step 1: Basic Information
  const Step1 = () => (
    <>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Basic Information
        </CardTitle>
        
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
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
            <Label htmlFor="userType">Account Type *</Label>
            <Select value={userType} onValueChange={(value: UserType) => setUserType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserType.BUYER}>House Buyer</SelectItem>
                <SelectItem value={UserType.SELLER}>House Seller</SelectItem>
                <SelectItem value={UserType.EMPLOYEE}>Job Seeker</SelectItem>
                <SelectItem value={UserType.EMPLOYER}>Employer</SelectItem>
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
        </div>
      </CardContent>
    </>
  )

  // Step 2: Profile Information
  const Step2 = () => (
    <>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Complete your profile details
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Addis Ababa, Ethiopia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              type="text"
              placeholder="Your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Employee-specific fields */}
          {userType === UserType.EMPLOYEE && (
            <>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree/Education *</Label>
                <Input
                  id="degree"
                  type="text"
                  placeholder="e.g., BSc Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="e.g., IT, Marketing"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={availability} onValueChange={(value: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT') => setAvailability(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salaryExpectation">Salary Expectation (ETB)</Label>
                <Input
                  id="salaryExpectation"
                  type="number"
                  placeholder="e.g., 15000"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Employer/Seller-specific fields */}
          {(userType === UserType.EMPLOYER || userType === UserType.SELLER) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="license">Business License (Optional)</Label>
                <Input
                  id="license"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload(setLicense)}
                />
                {license && (
                  <p className="text-sm text-green-600">✓ {license.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document">Business Document (Optional)</Label>
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload(setDocument)}
                />
                {document && (
                  <p className="text-sm text-green-600">✓ {document.name}</p>
                )}
              </div>
            </>
          )}

          {/* Profile photo for all users */}
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo (Optional)</Label>
            <Input
              id="photo"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileUpload(setPhoto)}
            />
            {photo && (
              <p className="text-sm text-green-600">✓ {photo.name}</p>
            )}
          </div>
        </div>
      </CardContent>
    </>
  )

  // Step 3: Email Verification
  const Step3 = () => (
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
            {isVerifying ? 'Verifying...' : 'Complete Registration'}
          </Button>
        </form>
      </CardContent>
    </>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 z-10 cursor-pointer"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="p-6">
          <StepIndicator />
          
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          
          {/* Navigation buttons */}
          {currentStep < 3 && (
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-4">
              {error}
            </div>
          )}
          
          {/* Login link */}
          {currentStep === 1 && (
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
          )}
        </div>
      </Card>
    </div>
  )
}
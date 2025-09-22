"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { UserType, adminAuthService } from '@/lib/api'
import { X, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { StepIndicator } from './StepIndicator'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'
import { RegistrationNavigation } from './RegistrationNavigation'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}


export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen)

  // Registration type (user or admin)
  const [registerType, setRegisterType] = useState<'user' | 'admin'>('user')

  // Set user type to ADMIN when admin registration is selected
  useEffect(() => {
    if (registerType === 'admin') {
      setUserType(UserType.ADMIN)
    } else {
      setUserType(UserType.BUYER) // Default for regular users
    }
  }, [registerType])

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = registerType === 'admin' ? 1 : 3 // Admin registration is simpler

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
  const { register, isLoading, error: authError } = useAuth()
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
    
    try {
      if (registerType === 'admin') {
        // Admin registration - same validation and endpoint as user but with ADMIN user type
        if (!name || !email || !password || !confirmPassword) {
          setError('Please fill in all required fields')
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
        
        if (phone && !validatePhoneNumber(phone)) {
          setError('Please enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)')
          return
        }
        
        // Use regular user registration with ADMIN user type
        const success = await register(name, email, phone, password, UserType.ADMIN)
        if (success) {
          onClose()
          resetForm()
          // Reload page to trigger redirect logic
          window.location.reload()
        } else {
          setError(authError || 'Admin registration failed')
        }
      } else {
        // Regular user registration
        const success = await register(name, email, phone, password, userType)
        if (success) {
          // User registration successful, now create profile
          try {
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
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
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


  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
      setOtpError('')
    }
  }



  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <Card className="w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 z-10 cursor-pointer"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-6 pb-8">
            {/* Registration Type Switcher */}
            <div className="flex border border-gray-200 rounded-lg mb-6 overflow-hidden">
              <button
                type="button"
                onClick={() => setRegisterType('user')}
                className={`flex-1 cursor-pointer flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                  registerType === 'user'
                    ? 'bg-[#007a7f] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                User Registration
              </button>
              <button
                type="button"
                onClick={() => setRegisterType('admin')}
                className={`flex-1 cursor-pointer flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                  registerType === 'admin'
                    ? 'bg-[#007a7f] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Registration
              </button>
            </div>
            
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            
            {registerType === 'admin' ? (
              // Admin registration form - same inputs as user but different endpoint
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xxxxxxxx or +2519xxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as UserType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                    disabled
                    aria-label="User type (automatically set to Admin)"
                  >
                    <option value={UserType.ADMIN}>Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">User type is automatically set to Admin</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                    required
                  />
                </div>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                >
                  {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
                </Button>
              </div>
            ) : (
              // Regular user registration steps
              <>
                {currentStep === 1 && (
                  <Step1 
                    name={name} setName={setName}
                    email={email} setEmail={setEmail}
                    phone={phone} setPhone={setPhone}
                    userType={userType} setUserType={setUserType}
                    password={password} setPassword={setPassword}
                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                  />
                )}
                {currentStep === 2 && (
                  <Step2 
                    location={location} setLocation={setLocation}
                    address={address} setAddress={setAddress}
                    degree={degree} setDegree={setDegree}
                    department={department} setDepartment={setDepartment}
                    experience={experience} setExperience={setExperience}
                    availability={availability} setAvailability={setAvailability}
                    salaryExpectation={salaryExpectation} setSalaryExpectation={setSalaryExpectation}
                    photo={photo} setPhoto={setPhoto}
                    document={document} setDocument={setDocument}
                    license={license} setLicense={setLicense}
                    userType={userType}
                    handleFileUpload={handleFileUpload}
                  />
                )}
                {currentStep === 3 && (
                  <Step3 
                    email={email}
                    otp={otp}
                    timeLeft={timeLeft}
                    STATIC_OTP={STATIC_OTP}
                    otpError={otpError}
                    isVerifying={isVerifying}
                    handleOtpChange={handleOtpChange}
                    handleOTPSubmit={handleOTPSubmit}
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="border-t bg-white px-6 py-4">
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          </div>
        )}
        
        {/* Navigation - Only for regular user registration */}
        {registerType === 'user' && (
          <RegistrationNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            isLoading={isLoading}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSwitchToLogin={onSwitchToLogin}
          />
        )}
      </Card>
    </div>
  )
}
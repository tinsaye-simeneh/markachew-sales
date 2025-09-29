"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { UserType } from '@/lib/api'
import { X } from 'lucide-react'
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
  useBodyScrollLock(isOpen)

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<UserType>(UserType.BUYER)
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
  const [cv, setCv] = useState<File | null>(null)
  const [otp, setOtp] = useState('')
  const [timeLeft] = useState(300)
  const [error, setError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const { register, error: authError } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const STATIC_OTP = '123456'

  const validatePhoneNumber = (phone: string): boolean => {
    const ethiopianPhoneRegex = /^(\+2519\d{8}|09\d{8})$/
    return ethiopianPhoneRegex.test(phone)
  }

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
    setIsLoading(true)
    try {
      const success = await register(name, email, phone, password, userType)
      if (success) {
        try {
          onClose()
          resetForm()
          router.push('/profile')
          //eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setError('Registration successful, but profile creation failed. Please complete your profile manually.')
        }
      } else {
        setError(authError || 'Registration failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    setIsVerifying(true)
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (otp === STATIC_OTP) {
      await handleFinalSubmit()
    } else {
      setOtpError('Invalid OTP. Please try again.')
    }
    
    setIsVerifying(false)
    setIsLoading(false)
  }

  const handleFileUpload = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setter(file)
  }


  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') 
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
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-6 pb-8">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            
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
                cv={cv} setCv={setCv}
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
          </div>
        </div>
        
        {error && (
          <div className="border-t bg-white px-6 py-4">
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          </div>
        )}
        
        
        <RegistrationNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        /> 
        
        <div className="text-center text-sm">
        Already have an account?{' '}
        <button
          type="button"
              className="text-primary hover:underline cursor-pointer"
          onClick={onSwitchToLogin}
        >
          Sign in
        </button>
      </div>
      </Card>
    </div>
  )
}
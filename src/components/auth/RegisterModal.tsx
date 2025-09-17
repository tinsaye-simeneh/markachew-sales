"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { X } from 'lucide-react'
import { OTPVerification } from './OTPVerification'
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
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [registeredData, setRegisteredData] = useState<{name: string, email: string, userType: 'employee' | 'employer' | 'buyer' | 'seller'} | null>(null)
  const { register, completeRegistration, isLoading } = useAuth()
  const router = useRouter()

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

    const success = await register(name, email, password, userType)
    console.log('Registration success:', success) // Debug
    if (success) {
      console.log('Setting OTP modal to show') // Debug
      setRegisteredEmail(email)
      setRegisteredData({ name, email, userType })
      setError('')
      setShowOTP(true)
      console.log('OTP modal should be showing now') // Debug
    } else {
      setError('Registration failed. Please try again.')
    }
  }

  const handleOTPBack = () => {
    setShowOTP(false)
    setRegisteredEmail('')
    setRegisteredData(null)
  }

  const handleOTPComplete = () => {
    // Complete the registration with the stored data
    if (registeredData) {
      completeRegistration(registeredData.name, registeredData.email, registeredData.userType)
    }
    
    // Reset form and close modal
    setName('')
    setEmail('')
    setPhone('')
    setPassword('')
    setConfirmPassword('')
    setUserType('buyer')
    setShowOTP(false)
    setRegisteredEmail('')
    setRegisteredData(null)
    onClose()
    // Redirect to home page
    router.push('/')
  }

  // Always show OTP modal if it's active, regardless of isOpen state
  if (showOTP) {
    console.log('Rendering OTP modal') // Debug
    return (
      <OTPVerification
        email={registeredEmail}
        onBack={handleOTPBack}
        onComplete={handleOTPComplete}
      />
    )
  }

  if (!isOpen) return null

  console.log('Modal render - showOTP:', showOTP, 'registeredEmail:', registeredEmail) // Debug

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
      </Card>
    </div>
  )
}
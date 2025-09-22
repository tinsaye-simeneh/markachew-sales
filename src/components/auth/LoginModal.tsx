"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { X, Mail, Phone } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister?: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading, error: authError } = useAuth()

  const validatePhoneNumber = (phone: string): boolean => {
    // Ethiopian phone number validation
    // Format: 09xxxxxxxx (10 digits starting with 09) or +2519xxxxxxxx (international format)
    const ethiopianPhoneRegex = /^(\+2519\d{8}|09\d{8})$/
    return ethiopianPhoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const identifier = loginMethod === 'email' ? email : phone
    
    if (!identifier || !password) {
      setError('Please fill in all fields')
      return
    }

    // Validate phone number format if using phone login
    if (loginMethod === 'phone' && !validatePhoneNumber(phone)) {
      setError('Please enter a valid Ethiopian phone number (09xxxxxxxx or +2519xxxxxxxx)')
      return
    }

    try {
      // Regular user login
      const success = await login(email, password)
      
      if (success) {
        onClose()
        setEmail('')
        setPhone('')
        setPassword('')
        // Reload page to trigger redirect logic
        window.location.reload()
      } else {
        setError(authError || `Invalid ${loginMethod} or password`)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
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
        
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Login Method Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
                className={`flex-1 cursor-pointer flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
                className={`flex-1 cursor-pointer flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Phone className="h-4 w-4 mr-2" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={loginMethod}>
                {loginMethod === 'email' ? 'Email' : 'Phone Number'}
              </Label>
              <Input
                id={loginMethod}
                type={loginMethod === 'email' ? 'email' : 'tel'}
                placeholder={
                  loginMethod === 'email' 
                    ? 'Enter your email' 
                    : '09xxxxxxxx or +2519xxxxxxxx'
                }
                value={loginMethod === 'email' ? email : phone}
                onChange={(e) => {
                  if (loginMethod === 'email') {
                    setEmail(e.target.value)
                  } else {
                    setPhone(e.target.value)
                  }
                }}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="text-primary hover:underline cursor-pointer"
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </div>
          <div className="mt-4 text-center text-sm">
            Forgot Password?{' '}
            <button
              type="button"
              className="text-primary hover:underline cursor-pointer"
              onClick={() => {}}
            >
              Reset here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
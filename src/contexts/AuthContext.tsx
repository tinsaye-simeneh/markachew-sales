"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, User, UserType } from '@/lib/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (fullName: string, email: string, phone: string, password: string, userType: UserType) => Promise<boolean>
  completeRegistration: (name: string, email: string, type: UserType) => void
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = authService.getStoredUser()
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const authResponse = await authService.login({ email, password })
      setUser(authResponse.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    fullName: string, 
    email: string, 
    phone: string, 
    password: string, 
    userType: UserType
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const authResponse = await authService.register({
        full_name: fullName,
        email,
        phone,
        password,
        user_type: userType
      })
      setUser(authResponse.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const completeRegistration = (name: string, email: string, type: UserType) => {
    // This method is kept for backward compatibility
    // In the new API, registration is completed immediately
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      completeRegistration, 
      logout, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
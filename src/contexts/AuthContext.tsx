"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, adminAuthService, User, UserType } from '@/lib/api'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  adminLogin: (email: string, password: string) => Promise<boolean>
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
    const storedUser = authService.getStoredUser()
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser)
    } else {
      const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true'
      if (isAdmin) {
        const adminUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (adminUserStr) {
          try {
            const adminUser = JSON.parse(adminUserStr)
            setUser(adminUser)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
          }
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    
    setError(null)
    try {
      const authResponse = await authService.login({ email, password })
      setUser(authResponse.user)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      return false
    } finally {
      
    }
  }

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const authResponse = await adminAuthService.login({ email, password })
      if (authResponse.success) {
        setUser(authResponse.user)
        return true
      }
      return false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Admin login failed'
      setError(errorMessage)
      return false
    }
  }

  const register = async (
    fullName: string, 
    email: string, 
    phone: string, 
    password: string, 
    userType: UserType
  ): Promise<boolean> => {
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
    }
  }

  const completeRegistration = () => {
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true'
      if (isAdmin) {
        await adminAuthService.logout()
      } else {
        await authService.logout()
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Logout error:', {
        description: 'Logout error'
      })
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      adminLogin,
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
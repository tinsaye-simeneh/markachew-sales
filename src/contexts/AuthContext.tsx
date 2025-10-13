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

function decodeRole(encoded: string): string {
  try {
    const scrambled = encoded.split('-')[1]
    if (!scrambled) return encoded
    
    const reversed = atob(scrambled)
    return reversed.split('').reverse().join('')
  } catch {
    return encoded
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser && authService.isAuthenticated()) {
      storedUser.user_type = decodeRole(storedUser.user_type as string) as UserType
      setUser(storedUser)
    } else {
      const isAdmin =
        typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true'
      if (isAdmin) {
        const adminUserStr =
          typeof window !== 'undefined' ? localStorage.getItem('user') : null
        if (adminUserStr) {
          try {
            const adminUser = JSON.parse(adminUserStr)
            adminUser.user_type = decodeRole(adminUser.user_type as string) as UserType
            setUser(adminUser)
          } catch {
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
      authResponse.user.user_type = decodeRole(authResponse.user.user_type as string) as UserType
      setUser(authResponse.user)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      return false
    }
  }

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const authResponse = await adminAuthService.login({ email, password })
      if (authResponse.success) {
        authResponse.user.user_type = decodeRole(authResponse.user.user_type as string) as UserType
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
      authResponse.user.user_type = decodeRole(authResponse.user.user_type as string) as UserType
      setUser(authResponse.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      return false
    }
  }

  const completeRegistration = () => {}

  const logout = async () => {
    setIsLoading(true)
    try {
      const isAdmin =
        typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true'
      if (isAdmin) {
        await adminAuthService.logout()
      } else {
        await authService.logout()
      }
    } catch {
      toast.error('Logout error:', {
        description: 'Logout error'
      })
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        adminLogin,
        register,
        completeRegistration,
        logout,
        isLoading,
        error
      }}
    >
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

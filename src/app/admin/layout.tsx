"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingPage } from '@/components/ui/loading'
import { UserType } from '@/lib/api'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Check if current path is a secure auth page
  const isAuthPage = pathname === '/admin/secure/login' || pathname === '/admin/secure/register'

  useEffect(() => {
    // Allow access to auth pages for everyone
    if (isAuthPage) {
      return
    }

    // For non-auth pages, check admin permissions
    if (!isLoading && (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN))) {
      router.push('/')
    }
  }, [user, isLoading, router, isAuthPage])

  if (isLoading) {
    return <LoadingPage />
  }

  // Allow access to auth pages for everyone
  if (isAuthPage) {
    return <>{children}</>
  }

  // For non-auth pages, require admin permissions
  if (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN)) {
    return null
  }

  return <>{children}</>
}
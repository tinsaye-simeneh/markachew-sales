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

  const isAuthPage = pathname === '/admin/secure/login' || pathname === '/admin/secure/register'

  useEffect(() => {
    if (isAuthPage) {
      return
    }

    if (!isLoading && (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN))) {
      router.push('/')
    }
  }, [user, isLoading, router, isAuthPage, pathname])

  if (isLoading) {
    return <LoadingPage />
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  if (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN)) {
    return null
  }

  return <>{children}</>
}
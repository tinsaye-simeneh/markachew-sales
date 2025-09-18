"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { LoadingPage } from '@/components/ui/loading'
import { UserType } from '@/lib/api'

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN))) {
      router.push('/admin')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingPage />
  }

  if (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN)) {
    return null
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
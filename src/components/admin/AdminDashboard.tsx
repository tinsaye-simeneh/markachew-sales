"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Briefcase, 
  Building, 
  RefreshCw
} from 'lucide-react'
import { useAdminStats, useAdminActivityLog } from '@/hooks/useAdminApi'

export function AdminDashboard() {
  const router = useRouter()
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats()
  const {  refetch: refetchActivities } = useAdminActivityLog()

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: 'green'
    },
    {
      title: 'Total Houses',
      value: stats?.totalHouses || 0,
      icon: Building,
      color: 'purple'
    },
   
  ]



  const handleRefresh = () => {
    refetchStats()
    refetchActivities()
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading dashboard: {statsError}</p>
        <Button onClick={handleRefresh} variant="outline" className='cursor-pointer'>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold leading-tight text-gray-900">Dashboard Overview</h3>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the admin dashboard. Here&apos;s what&apos;s happening in your application.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" className='cursor-pointer'>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 text-${stat.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
               
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start cursor-pointer" 
              variant="outline"
              onClick={() => router.push('/admin/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button 
              className="w-full justify-start cursor-pointer" 
              variant="outline"
              onClick={() => router.push('/admin/jobs')}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Review Job Postings
            </Button>
            <Button 
              className="w-full justify-start cursor-pointer" 
              variant="outline"
              onClick={() => router.push('/admin/houses')}
            >
              <Building className="mr-2 h-4 w-4" />
              Approve House Listings
            </Button>
           
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">API Status: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Database: Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Storage: 78% Used</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
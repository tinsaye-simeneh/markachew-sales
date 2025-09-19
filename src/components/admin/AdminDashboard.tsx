"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Briefcase, 
  Building, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { useAdminStats, useAdminActivityLog } from '@/hooks/useAdminApi'

export function AdminDashboard() {
  const router = useRouter()
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats()
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useAdminActivityLog()

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.recentUsers || 0,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      change: stats?.recentJobs || 0,
      icon: Briefcase,
      color: 'green'
    },
    {
      title: 'Total Houses',
      value: stats?.totalHouses || 0,
      change: stats?.recentHouses || 0,
      icon: Building,
      color: 'purple'
    },
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      change: stats?.recentApplications || 0,
      icon: FileText,
      color: 'orange'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

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
                <p className="text-xs text-muted-foreground flex items-center">
                  {stat.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stat.change > 0 ? '+' : ''}{stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/jobs')}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Review Job Postings
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/houses')}
            >
              <Building className="mr-2 h-4 w-4" />
              Approve House Listings
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/applications')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Review Applications
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
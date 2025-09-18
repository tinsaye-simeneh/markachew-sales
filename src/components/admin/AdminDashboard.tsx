"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  CheckCircle
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalJobs: number
  totalHouses: number
  totalApplications: number
  recentUsers: number
  recentJobs: number
  recentHouses: number
  recentApplications: number
}

const mockStats: DashboardStats = {
  totalUsers: 1248,
  totalJobs: 89,
  totalHouses: 156,
  totalApplications: 342,
  recentUsers: 23,
  recentJobs: 5,
  recentHouses: 8,
  recentApplications: 17
}

const recentActivity = [
  {
    id: 1,
    type: 'user_registration',
    message: 'New user registered: John Doe',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'job_posted',
    message: 'New job posted: Software Engineer',
    time: '15 minutes ago',
    status: 'info'
  },
  {
    id: 3,
    type: 'house_listed',
    message: 'New house listed in Downtown',
    time: '1 hour ago',
    status: 'info'
  },
  {
    id: 4,
    type: 'application_submitted',
    message: 'Application submitted for Marketing Manager',
    time: '2 hours ago',
    status: 'warning'
  },
  {
    id: 5,
    type: 'user_verification',
    message: 'User verification pending: Jane Smith',
    time: '3 hours ago',
    status: 'warning'
  }
]

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: stats.recentUsers,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      change: stats.recentJobs,
      icon: Briefcase,
      color: 'green'
    },
    {
      title: 'Total Houses',
      value: stats.totalHouses,
      change: stats.recentHouses,
      icon: Building,
      color: 'purple'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      change: stats.recentApplications,
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold leading-tight text-gray-900">Dashboard Overview</h3>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to the admin dashboard. Here's what's happening in your application.
        </p>
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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
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
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Review Job Postings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building className="mr-2 h-4 w-4" />
              Approve House Listings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
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
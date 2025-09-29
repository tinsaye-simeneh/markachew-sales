"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEmployerJobs, useEmployerApplications } from '@/hooks/useApi'
import { useAuth } from '@/contexts/AuthContext'
import { 
 
  Briefcase, 
  Users,  
  Calendar,
  BarChart3,
} from 'lucide-react'

export function EmployerAnalytics() {
  const { user } = useAuth()
  const { jobs, loading: jobsLoading } = useEmployerJobs(user?.id)
  const { applications, loading: applicationsLoading } = useEmployerApplications()

  // Calculate analytics data
  const totalJobs = jobs.length
  const activeJobs = jobs.filter(job => job.status === 'active').length
  const totalApplications = applications.length
  const approvedApplications = applications.filter(app => app.status === 'ACCEPTED').length
  const pendingApplications = applications.filter(app => app.status === 'PENDING').length
  const rejectedApplications = applications.filter(app => app.status === 'REJECTED').length
  
 
  // Calculate average applications per job
  const avgApplicationsPerJob = totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0

  // Get job performance data
  const jobPerformance = jobs.map(job => {
    const jobApplications = applications.filter(app => app.job?.id === job.id)
    return {
      id: job.id,
      title: job.title,
      applications: jobApplications.length,
      approved: jobApplications.filter(app => app.status === 'ACCEPTED').length,
      pending: jobApplications.filter(app => app.status === 'PENDING').length,
      rejected: jobApplications.filter(app => app.status === 'REJECTED').length,
      status: job.status
    }
  }).sort((a, b) => b.applications - a.applications)

  if (jobsLoading || applicationsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track the performance of your job postings</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track the performance of your job postings</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {activeJobs} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {avgApplicationsPerJob} avg per job
            </p>
          </CardContent>
        </Card>

      

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your decision
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status Breakdown</CardTitle>
          <CardDescription>Overview of application statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{approvedApplications}</div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingApplications}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{rejectedApplications}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Job Performance</CardTitle>
          <CardDescription>Applications received per job posting</CardDescription>
        </CardHeader>
        <CardContent>
          {jobPerformance.length > 0 ? (
            <div className="space-y-4">
              {jobPerformance.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{job.applications} total applications</span>
                      <span className="text-green-600">{job.approved} approved</span>
                      <span className="text-yellow-600">{job.pending} pending</span>
                      <span className="text-red-600">{job.rejected} rejected</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{job.applications}</div>
                    <div className="text-xs text-gray-500">applications</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No job performance data available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
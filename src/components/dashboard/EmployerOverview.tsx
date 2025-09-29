"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Job } from '@/lib/api'
import { 
  Plus, 
  Briefcase, 
  Users, 
  Eye, 
  Calendar,
} from 'lucide-react'
import { DataDisplay, DataDisplayColumn, createDataDisplayActions } from '@/components/ui/data-display'

interface EmployerOverviewProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  totalJobs: number
  activeJobs: number
  totalViews: number
  recentJobs: Job[]
  loading: boolean
  onEditJob: (job: Job) => void
  onCreateJob: () => void
  onDeleteJob?: (jobId: string) => void
  totalApplications?: number
  pendingApplications?: number
}

export function EmployerOverview({
  user,
  totalJobs,
  activeJobs,
  totalViews,
  recentJobs,
  loading,
  onEditJob,
  onCreateJob,
  onDeleteJob,
  totalApplications = 0,
  pendingApplications = 0
}: EmployerOverviewProps) {
  const getJobDetails = (job: Job) => {
    // Handle different formats of requirements and responsibility
    const getRequirementsText = () => {
      if (Array.isArray(job.requirements)) {
        return job.requirements.join(', ');
      } else if (typeof job.requirements === 'string') {
        try {
          const parsed = JSON.parse(job.requirements);
          if (Array.isArray(parsed)) {
            return parsed.join(', ');
          } else if (typeof parsed === 'object') {
            return Object.values(parsed).join(', ');
          }
          return parsed;
        } catch {
          return job.requirements;
        }
      } else if (typeof job.requirements === 'object') {
        return Object.values(job.requirements).join(', ');
      }
      return 'No requirements specified';
    };

    const getResponsibilitiesText = () => {
      if (Array.isArray(job.responsibility)) {
        return job.responsibility.join(', ');
      } else if (typeof job.responsibility === 'string') {
        try {
          const parsed = JSON.parse(job.responsibility);
          if (Array.isArray(parsed)) {
            return parsed.join(', ');
          } else if (typeof parsed === 'object') {
            return Object.values(parsed).join(', ');
          }
          return parsed;
        } catch {
          return job.responsibility;
        }
      } else if (typeof job.responsibility === 'object') {
        return Object.values(job.responsibility).join(', ');
      }
      return 'No responsibilities specified';
    };

    return {
      requirements: getRequirementsText(),
      responsibilities: getResponsibilitiesText(),
      status: job.status,
      link: job.link || null
    };
  };

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            {value?.substring(0, 100)}...
          </p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'SUSPENDED', label: 'Suspended' }
      ],
      render: (value) => (
        <Badge variant={
          value === 'ACTIVE' ? 'default' : 
          value === 'PENDING' ? 'secondary' :
          value === 'SUSPENDED' ? 'destructive' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Posted',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  // Define actions for DataDisplay
  const getActionsForJob = (job: Job) => {
    return [
    
      createDataDisplayActions.edit(() => {
        onEditJob(job)
      }),
      ...(onDeleteJob ? [createDataDisplayActions.delete(() => {
        onDeleteJob(job.id)
      })] : [])
    ]
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600">Manage your job postings and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Across all your jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {pendingApplications} pending review
            </p>
          </CardContent>
        </Card>

        
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your job postings efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={onCreateJob} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <DataDisplay
        data={recentJobs}
        columns={columns}
        actions={getActionsForJob}
        loading={loading}
        title="Recent Job Postings"
        description="Your latest job postings"
        defaultView="table"
        showViewToggle={true}
        showSearch={true}
        showFilters={true}
        showPagination={false}
        itemsPerPage={5}
        emptyMessage="No jobs posted yet"
        searchPlaceholder="Search jobs by title, description, or location..."
        searchFields={['title', 'description', 'location', 'salary']}
        onItemClick={() => {
        }}
        className="mt-6"
      />
    </div>
  )
}
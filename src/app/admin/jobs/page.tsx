"use client"

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { JobStatus } from '@/lib/api/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react'
import { useAdminJobs } from '@/hooks/useAdminApi'
import { toast } from 'sonner'
import { DataDisplay, DataDisplayColumn, createDataDisplayActions } from '@/components/ui/data-display'
import type { AdminJob } from '@/lib/api/admin-services'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { adminService } from '@/lib/api/admin-services'

export default function AdminJobsPage() {
  const {
    jobs,
    total,
    loading,
    fetchJobs,
    toggleJobStatus
  } = useAdminJobs({})
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<AdminJob | null>(null)


  const handleJobAction = async (action: string, jobId: string) => {
      switch (action) {
        case 'approve':
          await toggleJobStatus(jobId, 'ACTIVE')
          toast.success('Job approved successfully')
          fetchJobs()
          break
        case 'reject':
          await toggleJobStatus(jobId, 'INACTIVE')
          toast.success('Job rejected successfully')
          fetchJobs()
          break
          case 'delete':
              setJobToDelete(jobId as unknown as AdminJob)
            setIsDeleteModalOpen(true)
            break
      }
    }

  const confirmDeleteJob = async (jobId: string) => {
    await adminService.deleteJob(jobId) 
    toast.success('Job deleted successfully')
    setIsDeleteModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      PENDING: 'outline',
      EXPIRED: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (value) => (
        <div className="flex items-center  gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'employer.full_name',
      label: 'Employer',
      render: (value) => (
        <>
          <span>{value || 'Unknown'}</span>
          </>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'EXPIRED', label: 'Expired' }
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'applications_count',
      label: 'Applications',
      render: (value) => (
          <span className="font-medium">{value || 0}</span>
       
      )
    },
    {
      key: 'views_count',
      label: 'Views',
      render: (value) => (
          <span className="font-medium">{value || 0}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Posted',
      render: (value) => (
         <span>{new Date(value).toLocaleDateString()}</span>
        )
    }
  ]

  const actions = [
    {
      key: 'approve',
      label: 'Approve',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (job: AdminJob) => {
        handleJobAction('approve', job.id)
      },
      className: 'text-green-600'
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: <XCircle className="h-4 w-4" />,
      onClick: (job: AdminJob) => {
        handleJobAction('reject', job.id)
      },
      variant: 'destructive' as const
    },
    createDataDisplayActions.delete((job: AdminJob) => {
      handleJobAction('delete', job.id)
    })
  ]

  const getActionsForJob = (job: AdminJob) => {
    const availableActions = []
    
    // Show approve button for pending, inactive, or suspended jobs
    if (job.status === JobStatus.PENDING || job.status === JobStatus.INACTIVE || (job.status as string) === 'SUSPENDED') {
      availableActions.push(actions[0]) // Approve action
    }
    
    // Show reject button for pending or active jobs
    if (job.status === JobStatus.PENDING || job.status === JobStatus.ACTIVE) {
      availableActions.push(actions[1]) // Reject action
    }
    
    // Always show delete action
    availableActions.push(actions[2]) // Delete action
    
    return availableActions
  }

  if (loading && jobs.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }
  return (  
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold leading-tight text-gray-900">Job Management</h3>
            <p className="mt-2 text-sm text-gray-600">
              Manage and monitor all job postings on the platform.
            </p>
          </div>
            <div className='flex gap-5'>
            <Button variant="outline" onClick={() => fetchJobs()} className='cursor-pointer'>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All job postings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter(j => j.status === JobStatus.ACTIVE).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((jobs.filter(j => j.status === JobStatus.ACTIVE).length / total) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter(j => j.status === JobStatus.PENDING).length}
              </div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
        </div>


        <DataDisplay
          data={jobs}
          columns={columns}
          actions={getActionsForJob}
          loading={loading}
          title="Job Listings"
          description="Manage all job postings and applications"
          defaultView="table"
          emptyMessage="No jobs found. Job postings will appear here."
          searchPlaceholder="Search jobs by title, employer, or description..."
          searchFields={['title', 'employer.full_name', 'employer_name', 'description']}
          itemsPerPage={5}
          totalItems={total}
          onItemClick={() => {
          }}
        />
      </div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => confirmDeleteJob(jobToDelete?.id || '')}
        title="Delete Job"
        message="Are you sure you want to delete this job?"
      />
    </AdminLayout>
  );
}
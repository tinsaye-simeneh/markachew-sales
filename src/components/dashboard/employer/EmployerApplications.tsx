"use client"

import { DataDisplay, DataDisplayColumn } from '@/components/ui/data-display'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEmployerApplications, useUpdateApplication } from '@/hooks/useApi'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { Application } from '@/lib/api'
import { toast } from 'sonner'

export function EmployerApplications() {
  
  const { applications, loading, error, refetch } = useEmployerApplications()
  const { updateApplication } = useUpdateApplication()

  const handleStatusUpdate = async (applicationId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      await updateApplication(applicationId, { status: newStatus })
      refetch()
      toast.success(`Application ${newStatus.toLowerCase()}`)
    } catch (error) {
      console.error('Failed to update application status:', error)
      toast.error('Failed to update application status')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case 'PENDING':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
    {
      key: 'user.full_name',
      label: 'Applicant',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{value || 'Unknown User'}</span>
        </div>
      )
    },
    {
      key: 'user.email',
      label: 'Email',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{value || 'No email provided'}</span>
        </div>
      )
    },
    {
      key: 'user.phone',
      label: 'Phone',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{value || 'No phone provided'}</span>
        </div>
      )
    },
    {
      key: 'job.title',
      label: 'Job Position',
      render: (value) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span>{value || 'Unknown Job'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value),
      filterable: true,
      filterOptions: [
        { value: 'ACCEPTED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'PENDING', label: 'Pending' }
      ]
    },
    {
      key: 'createdAt',
      label: 'Applied',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  // Define actions for DataDisplay
  const actions = [
   
    {
      key: 'approve',
      label: 'Approve',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (application: Application) => {
        if (application.status === 'PENDING') {
          handleStatusUpdate(application.id, 'ACCEPTED')
        }
      },
      className: 'text-green-600'
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: <XCircle className="h-4 w-4" />,
      onClick: (application: Application) => {
        if (application.status === 'PENDING') {
          handleStatusUpdate(application.id, 'REJECTED')
        }
      },
      variant: 'destructive' as const
    }
  ]

  // Filter actions based on application status
  const getActionsForApplication = (application: Application) => {
    if (application.status === 'PENDING') {
      return actions
    }
    return [actions[0]] // Only show view action for non-pending applications
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
            

      <DataDisplay
        data={applications}
        columns={columns}
        actions={getActionsForApplication}
        loading={loading}
        title="Job Applications"
        description="Review and manage applications for your job postings"
        defaultView="card"
        emptyMessage="No applications yet. Applications for your job postings will appear here."
        onItemClick={() => {
        }} 
        showSearch={false}
        showViewToggle={true}
        showPagination={false}
        searchFields={['user.full_name', 'user.email', 'user.phone', 'job.title', 'status', 'createdAt']}
        searchPlaceholder="Search applications by applicant, email, phone, job title, status, or applied date..."
        itemsPerPage={5}
        totalItems={applications.length}
 
      />
    </div>
  )
}
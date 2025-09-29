"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { applicationsService } from '@/lib/api'
import { Application } from '@/lib/api/config'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DataDisplay, DataDisplayColumn } from '@/components/ui/data-display'
import { 
  ArrowLeft,
  User,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const jobId = params.jobId as string

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (jobId && user) {
      fetchApplications()
    }
  }, [jobId, user])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await applicationsService.getApplicationsByJob(jobId)
      setApplications(response.applications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case 'PENDING':
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  const columns: DataDisplayColumn[] = [
    {
      key: 'user.full_name',
      label: 'Applicant',
      sortable: true,
      render: ( application: Application) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <span className="font-medium">{application.user.full_name}</span>
            <div className="text-xs text-gray-500">{application.user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'user.phone',
      label: 'Contact',
      render: (application: Application) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{application.user.phone}</span>
        </div>
      )
    },
    {
      key: 'cover_letter',
      label: 'Cover Letter',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            {value?.substring(0, 100)}...
          </p>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Applied',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ]

  const getActionsForApplication = () => {
    return [
      {
        key: 'view',
        label: 'View Details',
        icon: <FileText className="h-4 w-4" />,
        onClick: () => {
          toast.info('View details functionality coming soon')
        },
        className: 'text-blue-600'
      }
    ]
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600">View applications for this job posting</p>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          
          <CardContent>
            <DataDisplay
              data={applications}
              columns={columns}
              actions={getActionsForApplication}
              loading={loading}
              title=""
              description=""
              defaultView="table"
              showViewToggle={true}
              showSearch={true}
              showFilters={true}
              showPagination={true}
              itemsPerPage={10}
              emptyMessage="No applications found for this job"
              searchPlaceholder="Search applications by name, email, or cover letter..."
              searchFields={['user.full_name', 'user.email', 'cover_letter']}
              onItemClick={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

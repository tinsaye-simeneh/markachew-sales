"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Job } from '@/lib/api'
import { 
  Plus, 
  Briefcase,
  Calendar,
  ExternalLink,
  Users,
  RefreshCcw
} from 'lucide-react'
import { DataDisplay, DataDisplayColumn, createDataDisplayActions } from '@/components/ui/data-display'
import { useRouter } from 'next/navigation'

interface EmployerJobsProps {
  myJobs: Job[]
  onEditJob: (job: Job) => void
  onCreateJob: () => void
  onDeleteJob: (jobId: string) => void
}

export function EmployerJobs({
  myJobs,
  onEditJob,
  onCreateJob,
  onDeleteJob,
}: EmployerJobsProps) {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getJobDetails = (job: Job) => { 
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
      key: 'link',
      label: 'Application Link',
      render: (value) => (
        <div className="flex items-center gap-2">
          {value ? (
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">View Link</span>
            </a>
          ) : (
            <span className="text-sm text-gray-400">No link</span>
          )}
        </div>
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
    const actions = []
    
    // Always show View Applications button for all jobs
    actions.push({
      key: 'applications',
      label: 'View Applications',
      icon: <Users className="h-4 w-4" />,
      onClick: () => {
        router.push(`/applications/job/${job.id}`)
      },
      className: 'text-blue-600'
    })
    
    // Always show edit and delete actions
    actions.push(
      createDataDisplayActions.edit(() => {
        onEditJob(job)
      }),
      createDataDisplayActions.delete(() => {
        onDeleteJob(job.id)
      })
    )
    
    return actions
  }


  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Job Postings</h1>
        <p className="text-gray-600">Manage all your job postings</p>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={onCreateJob} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <DataDisplay
        data={myJobs}
        columns={columns}
        actions={getActionsForJob}
        loading={false}
        title="All Job Postings"
        description="Manage all your job postings"
        defaultView="table"
        showViewToggle={true}
        showSearch={true}
        showFilters={true}
        showPagination={true}
        itemsPerPage={5}
        emptyMessage="No jobs posted yet"
        searchPlaceholder="Search jobs by title, description, location, or salary..."
        searchFields={['title', 'description', 'location', 'salary', 'requirements', 'responsibility']}
        onItemClick={() => {
        }}  
      />
    </div>
  )
}
"use client"

import { DataDisplay, DataDisplayAction, DataDisplayColumn, createDataDisplayActions } from '@/components/ui/data-display'
import { Badge } from '@/components/ui/badge'
import { Job, House } from '@/lib/api'


// Job Data Display Integration
export function JobsDataDisplay({ 
  jobs, 
  onEditJob, 
  onDeleteJob, 
  loading = false 
}: {
  jobs: Job[]
  onEditJob: (job: Job) => void
  onDeleteJob: (job: Job) => void
  loading?: boolean
}) {
  const columns: DataDisplayColumn[] = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true
    },
    {
      key: 'location',
      label: 'Location'
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (value) => value ? `$${value.toLocaleString()}` : 'Not specified'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          ACTIVE: 'default',
          INACTIVE: 'secondary',
          DRAFT: 'outline',
          CLOSED: 'destructive'
        } as const
        return (
          <Badge variant={variants[value as keyof typeof variants] || 'secondary'}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Posted',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const actions = [
   
    createDataDisplayActions.edit((job: Job) => onEditJob(job)),
    createDataDisplayActions.delete((job: Job) => onDeleteJob(job))
  ]

  return (
    <DataDisplay
      data={jobs}
      columns={columns}
      actions={actions}
      loading={loading}
      title="Job Listings"
      description="Manage your job postings and applications"
      defaultView="table"
      onItemClick={() => {
      }}
      showSearch={false}
      showViewToggle={false}
      showPagination={false}
      searchFields={['title', 'company', 'location', 'salary', 'status']}
      searchPlaceholder="Search jobs by title, company, location, salary, or status..."
      itemsPerPage={5}
      totalItems={jobs.length}
      
    />
  )
}

// Houses Data Display Integration
export function HousesDataDisplay({ 
  houses, 
  onEditHouse, 
  onDeleteHouse, 
  loading = false 
}: {
  houses: House[]
  onEditHouse: (house: House) => void
  onDeleteHouse: (house: House) => void
  loading?: boolean
}) {
  const columns: DataDisplayColumn[] = [
    {
      key: 'title',
      label: 'Property Title',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => value ? `$${value.toLocaleString()}` : 'Not specified'
    },
    {
      key: 'bedrooms',
      label: 'Bedrooms'
    },
    {
      key: 'bathrooms',
      label: 'Bathrooms'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          active: 'default',
          inactive: 'secondary',
          sold: 'destructive',
          pending: 'outline'
        } as const
        return (
          <Badge variant={variants[value as keyof typeof variants] || 'secondary'}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Listed',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const actions = [
 
    createDataDisplayActions.edit((house: House) => onEditHouse(house)),
    createDataDisplayActions.delete((house: House) => onDeleteHouse(house))
  ]

  return (
    <DataDisplay
      data={houses}
      columns={columns}
      actions={actions}
      loading={loading}
      title="Property Listings"
      description="Manage your property listings and inquiries"
      defaultView="grid"
      onItemClick={() => {
      }}
      showSearch={false}
      showViewToggle={false}
      showPagination={false}
      searchFields={['title', 'location', 'price', 'bedrooms', 'bathrooms']}
      searchPlaceholder="Search properties by title, location, or price..."
      itemsPerPage={5}
      totalItems={houses.length}
      
    />
  )
}

// Users Data Display Integration (for admin)
export function UsersDataDisplay({ 
  users, 
  onEditUser, 
  onDeleteUser, 
  loading = false 
}: {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[]
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditUser: (user: any) => void
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteUser: (user: any) => void
  loading?: boolean
}) {
  const columns: DataDisplayColumn[] = [
    {
      key: 'full_name',
      label: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'user_type',
      label: 'Type',
      render: (value) => {
        const variants = {
          EMPLOYER: 'default',
          EMPLOYEE: 'secondary',
          SELLER: 'outline',
          BUYER: 'outline',
          ADMIN: 'destructive'
        } as const
        return (
          <Badge variant={variants[value as keyof typeof variants] || 'secondary'}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          active: 'default',
          inactive: 'secondary',
          pending: 'outline',
          suspended: 'destructive'
        } as const
        return (
          <Badge variant={variants[value as keyof typeof variants] || 'secondary'}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'verification_status',
      label: 'Verified',
      render: (value) => {
        const variants = {
          verified: 'default',
          pending: 'outline',
          rejected: 'destructive'
        } as const
        return (
          <Badge variant={variants[value as keyof typeof variants] || 'secondary'}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const actions = [
   
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    createDataDisplayActions.edit((user: any) => onEditUser(user)),
    {
      key: 'suspend',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      label: (user: any) => user.status === 'active' ? 'Suspend' : 'Activate',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: (user: any) => user.status === 'active' ? '⏸️' : '▶️',
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: (user: any) => {
        if (user.status === 'active') {
          // onSuspendUser(user)
        } else {
          // onActivateUser(user)
        }
      }
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
      createDataDisplayActions.delete((user: any) => onDeleteUser(user))
  ]

  return (
    <DataDisplay
      data={users}
      columns={columns}
      actions={actions as DataDisplayAction[]}
      loading={loading}
      title="User Management"
      description="Manage user accounts and permissions"
      defaultView="table"
      onItemClick={() => {
      }} 
      showSearch={false}
      showViewToggle={false}
      showPagination={false}
      searchFields={['full_name', 'email', 'user_type', 'status', 'verification_status']}
      searchPlaceholder="Search users by name, email, type, status, or verification status..."
      itemsPerPage={5}
      totalItems={users.length}
      
    />
  )
}
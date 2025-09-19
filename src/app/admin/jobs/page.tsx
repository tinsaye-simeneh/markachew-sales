"use client"

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Briefcase, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye
} from 'lucide-react'
import { useAdminJobs } from '@/hooks/useAdminApi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

export default function AdminJobsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })
  const [currentPage, setCurrentPage] = useState(1)

  const {
    jobs,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchJobs,
    deleteJob,
    approveJob,
    rejectJob
  } = useAdminJobs({ ...filters, page: currentPage })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setCurrentPage(1)
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    setCurrentPage(1)
  }

  const handleJobAction = async (action: string, jobId: string, reason?: string) => {
    try {
      switch (action) {
        case 'approve':
          await approveJob(jobId)
          break
        case 'reject':
          await rejectJob(jobId, reason || 'Administrative rejection')
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this job?')) {
            await deleteJob(jobId)
          }
          break
      }
    } catch (error) {
      console.error('Error performing job action:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline',
      expired: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
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
          <Button className='cursor-pointer' onClick={() => router.push('/admin/jobs/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
          </div>
        </div>

        {/* Stats */}
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
                {jobs.filter(j => j.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((jobs.filter(j => j.status === 'active').length / total) * 100) : 0}% of total
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
                {jobs.filter(j => j.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className='mt-1' >
              <Label htmlFor="search" className='mb-2'>Search</Label>
              <Input
                id="search" 
                placeholder="Search jobs by title or description..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div>
                  <Label htmlFor="status" className='mb-2'>Status</Label>
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div>
                
            </div>
            </div>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>Manage all job postings and applications</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">Error: {error}</p>
              </div>
            )}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs found</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Posted by: {job.employer?.full_name || job.employer_name || 'Unknown'}</span>
                            <span>Applications: {job.applications_count || 0}</span>
                            <span>Views: {job.views_count || 0}</span>
                            <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(job.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('View job', job.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Edit job', job.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Job
                              </DropdownMenuItem>
                              {job.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleJobAction('approve', job.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Job
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleJobAction('reject', job.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Job
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleJobAction('delete', job.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} jobs
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
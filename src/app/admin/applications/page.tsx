"use client"

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  User,
  Briefcase
} from 'lucide-react'
import { useAdminApplications } from '@/hooks/useAdminApi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

export default function AdminApplicationsPage() {
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })
  const [currentPage, setCurrentPage] = useState(1)

  const {
    applications,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchApplications,
    updateApplication,
    deleteApplication
  } = useAdminApplications({ ...filters, page: currentPage })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setCurrentPage(1)
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    setCurrentPage(1)
  }

  const handleApplicationAction = async (action: string, applicationId: string) => {
    try {
      switch (action) {
        case 'accept':
          await updateApplication(applicationId, { status: 'ACCEPTED' })
          break
        case 'reject':
          await updateApplication(applicationId, { status: 'REJECTED' })
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this application?')) {
            await deleteApplication(applicationId)
          }
          break
      }
    } catch (error) {
      console.error('Error performing application action:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      reviewed: 'secondary',
      accepted: 'default',
      rejected: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  if (loading && applications.length === 0) {
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
          <div>
            <div className='flex justify-between items-center'>
            <div> 
            <h3 className="text-2xl font-bold leading-tight text-gray-900">Application Management</h3>
            <p className="mt-2 text-sm text-gray-600">
              Manage and monitor all job applications on the platform.
            </p>
            </div>
              <Button variant="outline" onClick={() => fetchApplications()} className='cursor-pointer'>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
        </div> 
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(a => a.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(a => a.status === 'ACCEPTED').length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <FileText className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(a => a.status === 'REJECTED').length}
              </div>
              <p className="text-xs text-muted-foreground">Not selected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className='mt-1' >
              <Label htmlFor="search" className='mb-2'>Search</Label>
            <Input
              placeholder="Search applications by applicant name or job title..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            </div>
           
          </div>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>Manage all job applications and their status</CardDescription>
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
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications found</p>
                </div>
              ) : (
                applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <h3 className="text-lg font-medium">{application.job_title}</h3>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Applied by: {application.applicant_name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Employer: {application.employer_name}</span>
                            <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                            {application.updatedAt !== application.createdAt && (
                              <span>Updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                          {application.cover_letter && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {application.cover_letter}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(application.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('View application', application.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Edit application', application.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Application
                              </DropdownMenuItem>
                              {application.status === 'PENDING' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApplicationAction('accept', application.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Accept Application
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleApplicationAction('reject', application.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Application
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleApplicationAction('delete', application.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Application
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
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} applications
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
"use client"

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { HouseStatus } from '@/lib/api/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye
} from 'lucide-react'
import { useAdminHouses } from '@/hooks/useAdminApi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function AdminHousesPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  })
  const [currentPage, setCurrentPage] = useState(1)

  const {
    houses,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchHouses,
    deleteHouse,
    approveHouse,
    rejectHouse
  } = useAdminHouses({ ...filters, page: currentPage })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setCurrentPage(1)
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    setCurrentPage(1)
  }

  const handleHouseAction = async (action: string, houseId: string, reason?: string) => {
    try {
      switch (action) {
        case 'approve':
          await approveHouse(houseId)
          break
        case 'reject':
          await rejectHouse(houseId, reason || 'Administrative rejection')
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this house listing?')) {
            await deleteHouse(houseId)
          }
          break
      }
    } catch (error) {
      console.error('Error performing house action:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline',
      sold: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  if (loading && houses.length === 0) {
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
            <h3 className="text-2xl font-bold leading-tight text-gray-900">House Management</h3>
            <p className="mt-2 text-sm text-gray-600">
              Manage and monitor all house listings on the platform.
            </p>
          </div>
          
          <div className='flex gap-5'>
          <Button variant="outline"  onClick={() => fetchHouses()} className='cursor-pointer'>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
           
            <Button className='cursor-pointer' onClick={() => router.push('/admin/houses/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add House
          </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All house listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {houses.filter(h => h.status === HouseStatus.ACTIVE).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((houses.filter(h => h.status === HouseStatus.ACTIVE).length / total) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {houses.filter(h => h.status === HouseStatus.SOLD).length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully sold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Building className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {houses.filter(h => h.status === HouseStatus.INACTIVE).length}
              </div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className='mb-2'>Search</Label>
            <Input
              placeholder="Search houses by title or location..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full mt-3"
            />
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
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div>
                  <Label htmlFor="type" className='mb-2'>Type</Label>

            <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
            </div>
           
          </div>
        </div>

        {/* Houses Table */}
        <Card>
          <CardHeader>
            <CardTitle>House Listings</CardTitle>
            <CardDescription>Manage all house listings and sales</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">Error: Failed to load houses</p>
              </div>
            )}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : houses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No houses found</p>
                </div>
              ) : (
                houses.map((house) => (
                  <div key={house.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{house.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{house.location}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Type: {house.type}</span>
                            <span>Price: ${parseFloat(house.price || '0').toLocaleString()}</span>
                            <span>Views: {house.views_count || 0}</span>
                            <span>Posted by: {house.owner?.full_name || house.seller_name || 'Unknown'}</span>
                            <span>Posted: {new Date(house.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusBadge(house.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('View house', house.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Edit house', house.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Listing
                              </DropdownMenuItem>
                              {house.status === HouseStatus.INACTIVE && (
                                <>
                                  <DropdownMenuItem onClick={() => handleHouseAction('approve', house.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Listing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleHouseAction('reject', house.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Listing
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleHouseAction('delete', house.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Listing
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
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} houses
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
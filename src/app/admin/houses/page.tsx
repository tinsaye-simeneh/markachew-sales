"use client"

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { HouseStatus } from '@/lib/api/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react'
import { useAdminHouses } from '@/hooks/useAdminApi'
import { toast } from 'sonner'
import { DataDisplay, DataDisplayColumn, createDataDisplayActions } from '@/components/ui/data-display'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import type { AdminHouse } from '@/lib/api/admin-services'

export default function AdminHousesPage() {

  const {
    houses,
    total,
    loading,
    error,
    fetchHouses,
    deleteHouse,
    approveHouse,
    rejectHouse
  } = useAdminHouses({})


  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    loading?: boolean
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  const handleHouseAction = async (action: string, houseId: string, reason?: string) => {
    try {
      switch (action) {
        case 'approve':
          await approveHouse(houseId)
          toast.success('House approved successfully')
          break
        case 'reject':
          await rejectHouse(houseId, reason || 'Administrative rejection')
          toast.success('House rejected successfully')
          break
        case 'delete':
          await deleteHouse(houseId)
          toast.success('House deleted successfully')
          break
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error performing house action', {
        description: 'Error performing house action'
      })
    }
  }

  const showDeleteConfirmation = (house: AdminHouse) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Delete House Listing',
      message: `Are you sure you want to delete "${house.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true }))
        try {
          await handleHouseAction('delete', house.id)
          setConfirmationModal(prev => ({ ...prev, isOpen: false, loading: false }))
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setConfirmationModal(prev => ({ ...prev, loading: false }))
        }
      }
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      PENDING: 'outline',
      SOLD: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  const columns: DataDisplayColumn[] = [
    {
      key: 'title',
      label: 'House Title',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      filterable: true,
      filterOptions: [
        { value: 'SALES', label: 'For Sale' },
        { value: 'RENT', label: 'For Rent' }
      ],
      render: (value) => (
        <Badge variant="outline">{value === 'SALES' ? 'For Sale' : value === 'RENT' ? 'For Rent' : value}</Badge>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="font-medium">${parseFloat(value?.toString() || '0').toLocaleString()}</span>
        </div>
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
        { value: 'SOLD', label: 'Sold' }
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'owner.full_name',
      label: 'Owner',
      render: (value, house) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>{value || house.owner?.full_name || 'Unknown'}</span>
        </div>
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
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  const actions = [
    {
      key: 'approve',
      label: 'Approve',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (house: AdminHouse) => {
        if (house.status === HouseStatus.INACTIVE) {
          handleHouseAction('approve', house.id)
        }
      },
      className: 'text-green-600'
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: <XCircle className="h-4 w-4"/>,
      onClick: (house: AdminHouse) => {
        if (house.status === HouseStatus.INACTIVE) {
          handleHouseAction('reject', house.id)
        }
      },
      variant: 'destructive' as const
    },
    createDataDisplayActions.delete((house: AdminHouse) => {
      showDeleteConfirmation(house)
    })
  ]

  const getActionsForHouse = (house: AdminHouse) => {
    if (house.status === HouseStatus.INACTIVE) {
      return actions
    }
    return [actions[2]] // Only Delete action for non-inactive houses
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

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => fetchHouses()} variant="outline">
              Try Again
            </Button>
          </div>
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

        <DataDisplay
          data={houses || []}
          columns={columns}
          actions={getActionsForHouse}
          loading={loading}
          title="House Listings"
          description="Manage all house listings and sales"
          defaultView="table"
          emptyMessage="No houses found. House listings will appear here."
          searchPlaceholder="Search houses by title, location, or owner..."
          searchFields={['title', 'location', 'owner.full_name', 'type']}
          itemsPerPage={5}
          totalItems={total || 0}
          onItemClick={() => {
          }}
        />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={confirmationModal.loading}
        />
      </div>
    </AdminLayout>
  )
}
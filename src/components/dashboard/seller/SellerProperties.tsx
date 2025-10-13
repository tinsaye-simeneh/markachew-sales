"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { House } from '@/lib/api/config'
import { DataDisplay, DataDisplayColumn, createDataDisplayActions } from '@/components/ui/data-display'
import { Plus, RefreshCw } from 'lucide-react'


interface SellerPropertiesProps {
  myHouses: House[]
  loading: boolean
  onEditHouse: (house: House) => void
  onDeleteHouse: (houseId: string, houseTitle: string) => void
  onCreateHouse: () => void
  onRefresh: () => void
}

export function SellerProperties({
  myHouses,
  loading,
  onEditHouse,
  onDeleteHouse,
  onCreateHouse,
  onRefresh
}: SellerPropertiesProps) {

  const handleDeleteHouse = (house: House) => {
    onDeleteHouse(house.id, house.title)
  }

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
      render: (value) => value ? `ETB ${value.toLocaleString()}` : 'Not specified'
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
      key: 'type',
      label: 'Type',
      render: (value) => {
        if (!value) return 'Not specified'
        return (
          <Badge variant={'default'}>
            {value.toUpperCase()}
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

  // Define actions for DataDisplay
  const actions = [
    createDataDisplayActions.edit((house: House) => onEditHouse(house)),
    createDataDisplayActions.delete((house: House) => handleDeleteHouse(house))
  ]

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <p className="text-gray-600">Manage your property listings and inquiries</p>
        </div>
      
      <div className="flex justify-end items-center">
        <div>
        <Button 
          variant="outline" 
          className='cursor-pointer mr-4' 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
<Button onClick={onCreateHouse} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          List New Property
        </Button>

</div>
</div>
      </div>

      <DataDisplay
        data={myHouses}
        columns={columns}
        actions={actions}
        loading={loading}
        title="Properties"
        description="Manage your properties"
        defaultView="table"
        onItemClick={() => {
        }}
        showSearch={true}
        showViewToggle={true}
        showPagination={true}
        searchFields={['title', 'location', 'price', 'bedrooms', 'bathrooms']}
        searchPlaceholder="Search properties by title, location, or price..."
        itemsPerPage={5}
        totalItems={myHouses.length}
      />
    </div>
  )
}
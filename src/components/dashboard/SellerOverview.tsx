"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { House } from '@/lib/api/config'
import { 
  Plus, 
  Home, 
  Users, 
  Edit, 
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square
} from 'lucide-react'

interface SellerOverviewProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  totalHouses: number
  activeHouses: number  
  totalInquiries: number
  pendingInquiries: number
  recentHouses: House[]
  loading: boolean
  error?: string | null
  onEditHouse: (house: House) => void
  onCreateHouse: () => void
}

export function SellerOverview({
  user,
  totalHouses,
  activeHouses,
  totalInquiries,
  pendingInquiries,
  recentHouses,
  loading,
  onEditHouse,
  onCreateHouse
}: SellerOverviewProps) {

    const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M ETB`
    }
    return `${numPrice.toLocaleString()} ETB`
  }

  const getHouseFeatures = (features: string) => {
    try {
      return JSON.parse(features || '{}')
    } catch {
      return {}
    }
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600">Manage your property listings and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHouses}</div>
            <p className="text-xs text-muted-foreground">
              {activeHouses} currently active
            </p>
          </CardContent>
        </Card>

       

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInquiries} pending inquiries
            </p>
          </CardContent>
        </Card>

        
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your property listings efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={onCreateHouse} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                List New Property
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Property Listings</CardTitle>
          <CardDescription>Your latest property listings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading properties...</p>
            </div>
          ) : recentHouses.length > 0 ? (
            <div className="space-y-4">
              {recentHouses.map((house) => {
                const features = getHouseFeatures(house.features || '')
                return (
                  <div key={house.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{house.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {house.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatPrice(house.price)}
                        </div>
                        {features.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {features.bedrooms} bed
                          </div>
                        )}
                        {features.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {features.bathrooms} bath
                          </div>
                        )}
                        {features.area && (
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {features.area} sq ft
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={house.status === 'active' ? 'default' : 'secondary'}>
                        {house.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditHouse(house)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                       
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No properties listed yet</p>
              <Button onClick={onCreateHouse} className="mt-4 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                List Your First Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
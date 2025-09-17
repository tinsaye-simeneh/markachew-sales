"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react'

interface House {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  type: 'apartment' | 'house' | 'condo' | 'townhouse'
  status: 'for-sale' | 'for-rent' | 'sold'
}

interface HouseCardProps {
  house: House
}

export function HouseCard({ house }: HouseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🏠</span>
            </div>
            <p className="text-sm">Property Image</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white cursor-pointer"
        >
          <Heart className="h-4 w-4" />
        </Button>
        
        <Badge 
          variant={house.status === 'for-sale' ? 'default' : house.status === 'for-rent' ? 'secondary' : 'destructive'}
          className="absolute top-2 left-2 text-white"
        >
          {house.status === 'for-sale' ? 'For Sale' : house.status === 'for-rent' ? 'For Rent' : 'Sold'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg group-hover:text-[#007a7f] transition-colors">
            {house.title}
          </h3>
          <Badge variant="outline" className="text-xs">
            {house.type}
          </Badge>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {house.location}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-[#007a7f]">
            {formatPrice(house.price)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {house.bedrooms} bed
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {house.bathrooms} bath
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {house.area} sqft
          </div>
        </div>
        
        <Button className="w-full cursor-pointer" variant="outline">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
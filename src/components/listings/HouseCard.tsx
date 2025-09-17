"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bath, Square, Heart, Home } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { House } from '@/data/sampleData'

interface HouseCardProps {
  house: House
}

export function HouseCard({ house }: HouseCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Always call the hook, but handle client-side logic inside
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleHouseClick = (houseId: string) => {
    router.push(`/houses/${houseId}`)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isClient) return // Don't handle clicks during SSR
    
    if (isFavorite(house.id, 'house')) {
      removeFromFavorites(house.id, 'house')
    } else {
      addToFavorites(house, 'house')
    }
  }

  const isHouseFavorited = isClient ? isFavorite(house.id, 'house') : false

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden p-0 pb-6">
      <div className="relative overflow-hidden rounded-t-lg cursor-pointer" onClick={() => handleHouseClick(house.id)}>
        {!imageError ? (
          <Image 
            src={house.image} 
            alt={house.title} 
            width={400} 
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
            <Home className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-sm font-medium">Image not available</p>
            <p className="text-xs text-gray-400">{house.title}</p>
          </div>
        )}
         
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white cursor-pointer"
          onClick={handleFavoriteClick}
        >
          <Heart className={`h-4 w-4 ${isHouseFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
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
          <h3 className="font-semibold cursor-pointer text-lg group-hover:text-[#007a7f] transition-colors" onClick={() => handleHouseClick(house.id)}>
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
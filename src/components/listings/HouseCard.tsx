"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bath, Square, Heart, Home, Edit } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { House, UserType } from '@/lib/api'
import { toast } from 'sonner'

interface HouseCardProps {
  house: House
  onEdit?: (house: House) => void
}

export function HouseCard({ house, onEdit }: HouseCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { user } = useAuth()
  
  // Always call the hook, but handle client-side logic inside
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice)
  }

  // Parse images JSON string
  const getHouseImages = () => {
    try {
      const images = JSON.parse(house.images || '[]');
      return Array.isArray(images) && images.length > 0 ? images[0] : null;
    } catch {
      return null;
    }
  }

  const getHouseFeatures = () => {
    try {
      const features = JSON.parse(house.features || '{}');
      return {
        bedrooms: features.bedrooms || 'N/A',
        bathrooms: features.bathrooms || 'N/A',
        area: features.area || house.area || 'N/A'
      };
    } catch {
      return {
        bedrooms: 'N/A',
        bathrooms: 'N/A',
        area: house.area || 'N/A'
      };
    }
  }

  const houseImage = getHouseImages();
  const houseFeatures = getHouseFeatures();

  const handleHouseClick = (houseId: string) => {
    router.push(`/houses/${houseId}`)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isClient) return 
    
    if (isFavorite(house.id, 'house')) {
      removeFromFavorites(house.id, 'house')
      toast.success("Removed from favorites", {
        description: `${house.title} has been removed from your saved list`,
        action: {
          label: "View Saved",
          onClick: () => router.push('/saved')
        }
      })
    } else {
      addToFavorites(house, 'house')
      toast.success("Added to favorites!", {
        description: `${house.title} has been saved to your favorites`,
        action: {
          label: "View Saved",
          onClick: () => router.push('/saved')
        }
      })
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(house)
    }
  }

  const isSeller = user?.user_type === UserType.SELLER && user?.id === house.user_id

  const isHouseFavorited = isClient ? isFavorite(house.id, 'house') : false

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden p-0 pb-6">
      <div className="relative overflow-hidden rounded-t-lg cursor-pointer" onClick={() => handleHouseClick(house.id)}>
        {houseImage && !imageError ? (
          <Image 
            src={houseImage} 
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
         
        
        <div className="absolute top-2 right-2 flex gap-1">
          {isSeller && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white cursor-pointer"
              onClick={handleEditClick}
              title="Edit house"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 hover:bg-white cursor-pointer"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isHouseFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
        
        <Badge 
          variant={house.status === 'active' ? 'default' : house.status === 'sold' ? 'secondary' : 'destructive'}
          className={`absolute top-2 left-2 ${house.status === 'active' ? 'bg-[#007a7f]' : house.status === 'sold' ? 'bg-[#007a7f]' : 'bg-red-500'} text-white`}
        >
          {house.status === 'active' ? 'Active' : house.status === 'sold' ? 'Sold' : 'Inactive'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold cursor-pointer text-lg group-hover:text-[#007a7f] transition-colors" onClick={() => handleHouseClick(house.id)}>
            {house.title}
          </h3>
          <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
           {house.category?.name || 'N/A'} 
          </Badge>
          <Badge variant="outline" className="text-xs">
            {house.type || 'N/A'}
          </Badge>
          </div>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {house.location || 'N/A'}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-[#007a7f]">
            {formatPrice(house.price || 0)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {houseFeatures.bedrooms || 'N/A'} bed
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {houseFeatures.bathrooms || 'N/A'} bath
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {houseFeatures.area || 'N/A'} sqft
          </div>
        </div>
        
        <Button className="w-full cursor-pointer" variant="outline" onClick={() => handleHouseClick(house.id)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
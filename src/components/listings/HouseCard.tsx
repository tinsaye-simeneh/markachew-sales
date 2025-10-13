"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin,  Heart, Home, Edit, X, ArrowRight } from 'lucide-react'
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
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const { user } = useAuth()
  
  const { toggleFavorite, isFavorite, loading } = useFavorites()

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

  const getHouseImages = () => {
    try {
      const images = JSON.parse(house.images || '[]');
      return Array.isArray(images) && images.length > 0 ? images[0] : null;
    } catch {
      return null;
    }
  }

  

  const houseImage = getHouseImages();

  const handleHouseClick = (houseId: string) => {
    router.push(`/houses/${houseId}`)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isClient || loading) return 
    
    await toggleFavorite(house.id, 'house')
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
            className={`absolute top-2 left-2 ${house.status === 'active' ? 'bg-primary' : house.status === 'sold' ? 'bg-primary' : 'bg-red-500'} text-white`}
        >
          {house.status === 'active' ? 'Active' : house.status === 'sold' ? 'Sold' : 'Inactive'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold cursor-pointer text-lg group-hover:text-primary transition-colors" onClick={() => handleHouseClick(house.id)}>
            {house.title}
          </h3>
          <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
           {house.category?.name || 'N/A category'} 
          </Badge>
          <Badge variant="outline" className="text-xs">
            {house.type || 'N/A type'} 
          </Badge>
          </div>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {house.location || 'N/A location'}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(house.price || 0)}
          </span>
        </div>
        
      
        
        <div className="space-y-2">
            <Button className="w-full cursor-pointer" variant="outline" onClick={() => handleHouseClick(house.id)}>
            <ArrowRight className="h-4 w-4 mr-2" />
            View Details
          </Button>
         
        </div>
      </CardContent>

      {showInquiryModal && (
        <InquiryModal
          house={house}
          onClose={() => setShowInquiryModal(false)}
          onSuccess={() => {
            setShowInquiryModal(false)
            toast.success('Your inquiry has been sent successfully!')
          }}
        />
      )}
    </Card>
  )
}

// Inquiry Modal Component
interface InquiryModalProps {
  house: House
  onClose: () => void
  onSuccess: () => void
}

function InquiryModal({ house, onClose, onSuccess }: InquiryModalProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    if (!user) {
      setError('You must be logged in to send an inquiry')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create inquiry data
      const inquiryData = {
        house_id: house.id,
        user_id: user.id,
        message: message.trim(),
        status: 'PENDING'
      }

      // Submit inquiry (you'll need to implement this API call)
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      })

      if (!response.ok) {
        throw new Error('Failed to send inquiry')
      }

      onSuccess()
    } catch (error) {
      console.error('Error sending inquiry:', error)
      setError('Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Send Inquiry</h3>
              <p className="text-sm text-gray-600 mt-1">
                Send a message to the seller about {house.title}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'm interested in this property. Could you tell me more about it?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what you&apos;d like to know about the property.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 cursor-pointer"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer"
                disabled={loading || !message.trim()}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
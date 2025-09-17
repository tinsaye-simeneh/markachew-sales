"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingPage } from '@/components/ui/loading'
import { getHouseById } from '@/data/sampleData'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  Mail,
  Star,
  Shield
} from 'lucide-react'

interface House {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  description: string
  features: string[]
  type: string
  yearBuilt: number
  status: string
  images: string[]
  amenities: string[]
  agent: {
    name: string
    phone: string
    email: string
    image: string
    rating: number
  }
}

export default function HouseDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const houseId = parseInt(params.id as string)
  
  const [house, setHouse] = useState<House | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Find house data
  useEffect(() => {
    const foundHouse = getHouseById(houseId.toString())
    if (foundHouse) {
      setHouse(foundHouse)
    }
  }, [houseId])

  const handleBack = () => {
    router.push('/houses')
  }

  const handleContactAgent = () => {
    // In a real app, this would open a contact form or initiate a call
    alert(`Contacting ${house?.agent.name} at ${house?.agent.phone}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">House Not Found</h1>
            <Button onClick={handleBack} className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Houses
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Houses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative">
                <img
                  src={house.images[currentImageIndex]}
                  alt={house.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="cursor-pointer"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="secondary" className="cursor-pointer">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex space-x-2 mt-4">
                {house.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-[#007a7f]' : 'border-gray-200'
                    } cursor-pointer`}
                  >
                    <img src={image} alt={`${house.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{house.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {house.location}
                    </div>
                    <Badge variant="secondary" className="mb-4">{house.type}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#007a7f]">{formatPrice(house.price)}</div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-1">{house.bedrooms}</span>Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-1">{house.bathrooms}</span>Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-1">{house.area}m²</span>Area</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{house.description}</p>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {house.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-[#007a7f] rounded-full mr-2"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Property Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#007a7f]" />
                      <span className="text-gray-700">Year Built: {house.yearBuilt}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-[#007a7f]" />
                      <span className="text-gray-700">Security: 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Agent */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={house.agent.image}
                    alt={house.agent.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">{house.agent.name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {house.agent.rating}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleContactAgent}
                    className={`w-full cursor-pointer ${house.status === "sold" ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`w-full cursor-pointer ${house.status === "sold" ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">{house.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium">{house.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium">{house.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area</span>
                    <span className="font-medium">{house.area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">{house.yearBuilt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
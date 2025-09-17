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
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Car,
  Shield,
  Wifi,
  TreePine,
  Phone,
  Mail,
  Star
} from 'lucide-react'

// Sample house data (same as in houses page)
const sampleHouses = [
  {
    id: 1,
    title: "Modern Villa in Bole",
    price: 25000000,
    location: "Bole, Addis Ababa",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: "/api/placeholder/800/600",
    description: "Beautiful modern villa with garden and parking space. This stunning property offers the perfect blend of contemporary design and comfortable living. Located in the prestigious Bole area, this villa provides easy access to shopping centers, restaurants, and business districts.",
    features: ["Garden", "Parking", "Security", "Furnished"],
    type: "Villa",
    yearBuilt: 2020,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    amenities: [
      "Swimming Pool",
      "Garden",
      "Parking Space",
      "Security System",
      "Air Conditioning",
      "High-Speed Internet",
      "Modern Kitchen",
      "Walk-in Closet"
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "+251 91 123 4567",
      email: "sarah@realestate.com",
      rating: 4.8,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: 2,
    title: "Cozy Apartment in Kazanchis",
    price: 8500000,
    location: "Kazanchis, Addis Ababa",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: "/api/placeholder/800/600",
    description: "Well-maintained apartment in the heart of the city. This cozy apartment offers modern amenities and is perfect for young professionals or small families.",
    features: ["Balcony", "Elevator", "Security"],
    type: "Apartment",
    yearBuilt: 2018,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    amenities: [
      "Balcony",
      "Elevator",
      "Security",
      "Air Conditioning",
      "Internet Ready"
    ],
    agent: {
      name: "Michael Chen",
      phone: "+251 92 234 5678",
      email: "michael@realestate.com",
      rating: 4.6,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: 3,
    title: "Luxury Penthouse in Cazanchis",
    price: 45000000,
    location: "Cazanchis, Addis Ababa",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    image: "/api/placeholder/800/600",
    description: "Exclusive penthouse with panoramic city views. This luxury penthouse offers the ultimate in urban living with breathtaking views of the city skyline. Features include a private rooftop terrace, premium finishes, and state-of-the-art amenities.",
    features: ["City View", "Rooftop", "Gym", "Pool"],
    type: "Penthouse",
    yearBuilt: 2022,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    amenities: [
      "Private Rooftop",
      "City Views",
      "Gym",
      "Swimming Pool",
      "Concierge Service",
      "Premium Finishes",
      "Smart Home System",
      "Private Elevator"
    ],
    agent: {
      name: "David Wilson",
      phone: "+251 93 345 6789",
      email: "david@realestate.com",
      rating: 4.9,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: 4,
    title: "Family House in Gerji",
    price: 18000000,
    location: "Gerji, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: "/api/placeholder/800/600",
    description: "Perfect family home with large backyard. This charming family house offers spacious living areas, a beautiful garden, and a quiet neighborhood perfect for raising children. The property features modern amenities while maintaining a cozy, homey feel.",
    features: ["Garden", "Parking", "Quiet Area"],
    type: "House",
    yearBuilt: 2015,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    amenities: [
      "Large Garden",
      "Parking Space",
      "Quiet Neighborhood",
      "Family-Friendly",
      "Modern Kitchen",
      "Spacious Living Areas",
      "Storage Space",
      "Security"
    ],
    agent: {
      name: "Emily Rodriguez",
      phone: "+251 94 456 7890",
      email: "emily@realestate.com",
      rating: 4.7,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: 5,
    title: "Studio Apartment in Piassa",
    price: 3500000,
    location: "Piassa, Addis Ababa",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image: "/api/placeholder/800/600",
    description: "Compact studio perfect for young professionals. This modern studio apartment is ideal for young professionals who want to live in the heart of the city. Despite its compact size, it offers all the essential amenities and a great location.",
    features: ["Furnished", "Central Location"],
    type: "Studio",
    yearBuilt: 2019,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    amenities: [
      "Fully Furnished",
      "Central Location",
      "Modern Appliances",
      "High-Speed Internet",
      "Security",
      "Elevator",
      "Laundry Facilities",
      "Near Public Transport"
    ],
    agent: {
      name: "James Kim",
      phone: "+251 95 567 8901",
      email: "james@realestate.com",
      rating: 4.5,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: 6,
    title: "Townhouse in CMC",
    price: 12000000,
    location: "CMC, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: "/api/placeholder/800/600",
    description: "Modern townhouse with contemporary design. This stylish townhouse features contemporary architecture and modern amenities. Perfect for families who want a modern living space with easy access to the city center.",
    features: ["Modern Design", "Parking", "Security"],
    type: "Townhouse",
    yearBuilt: 2021,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    amenities: [
      "Modern Design",
      "Parking Space",
      "Security System",
      "Contemporary Finishes",
      "Open Plan Living",
      "Private Garden",
      "Energy Efficient",
      "Near Amenities"
    ],
    agent: {
      name: "Lisa Thompson",
      phone: "+251 96 678 9012",
      email: "lisa@realestate.com",
      rating: 4.6,
      image: "/api/placeholder/100/100"
    }
  }
]

export default function HouseDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const houseId = parseInt(params.id as string)
  
  const [house, setHouse] = useState<any>(null)
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
    const foundHouse = sampleHouses.find(h => h.id === houseId)
    setHouse(foundHouse)
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
                    <div className="font-semibold">{house.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{house.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{house.area}m²</div>
                    <div className="text-sm text-gray-600">Area</div>
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
                    className="w-full cursor-pointer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full cursor-pointer"
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
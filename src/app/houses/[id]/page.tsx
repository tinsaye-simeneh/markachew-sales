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
import { useHouse } from '@/hooks/useApi'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { ShareModal } from '@/components/ui/share-modal'
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
  Star,
  Shield,
  Home,
  MessageCircle,
  Send,
  X
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useFavorites } from '@/contexts/FavoritesContext'

export default function HouseDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const houseId = params.id as string
  const { addToFavorites, removeFromFavorites, isFavorite: isHouseFavorite } = useFavorites()
  const [isClient, setIsClient] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)

  const { house, loading: houseLoading, error: houseError } = useHouse(houseId)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/')
  //   }
  // }, [user, isLoading, router])

  const handleBack = () => {
    router.push('/houses')
  }

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const handleCloseModals = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(false)
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleContactAgent = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    
    const ownerPhone = house?.owner?.phone as string
    if (ownerPhone) {
      window.location.href = `tel:${ownerPhone}`
    } else {
      toast.error('Owner phone number not found, please use the message feature to contact the owner')
    }
  }

  const handleSendMessage = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setIsInquiryModalOpen(true)
  }

  const handleSubmitInquiry = async () => {
    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsSubmittingInquiry(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          house_id: houseId,
          message: inquiryMessage.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send inquiry')
      }

      toast.success('Your inquiry has been sent successfully!')
      setIsInquiryModalOpen(false)
      setInquiryMessage('')
    } catch (error) {
      console.error('Error sending inquiry:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send inquiry'
      toast.error(errorMessage)
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  const handleCloseInquiryModal = () => {
    setIsInquiryModalOpen(false)
    setInquiryMessage('')
  }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false)
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(numPrice)
  }

  const getHouseImages = () => {
    try {
      const images = JSON.parse(house?.images || '[]');
      return Array.isArray(images) && images.length > 0 ? images : [];
    } catch {
      return [];
    }
  }

  const getHouseFeatures = () => {
    try {
      const features = JSON.parse(house?.features || '{}');
      return {
        bedrooms: features.bedrooms || 'N/A',
        bathrooms: features.bathrooms || 'N/A',
        area: features.area || house?.area || 'N/A',
        yearBuilt: features.yearBuilt || 'N/A',
        amenities: features.amenities || []
      };
    } catch {
      return {
        bedrooms: 'N/A',
        bathrooms: 'N/A',
        area: house?.area || 'N/A',
        yearBuilt: 'N/A',
        amenities: []
      };
    }
  }

  const houseImages = getHouseImages();
  const houseFeatures = getHouseFeatures();

  if (houseLoading) {
    return <LoadingPage />
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isClient) return
    
    if (house && isHouseFavorite(house.id, 'house')) {
      removeFromFavorites(house.id, 'house')
      toast.success("Removed from favorites", {
        description: `${house.title} at ${house.owner?.full_name || 'Unknown Owner'} has been removed from your saved list`,
        action: {
          label: "View Saved",
          onClick: () => router.push('/saved')
        }
      })
    } else {
      if (house) {
        addToFavorites(house, 'house')
      }
      toast.success("Added to favorites!", {
        description: `${house?.title} at ${house?.owner?.full_name || 'Unknown Owner'} has been saved to your favorites`,
        action: {
          label: "View Saved",
          onClick: () => router.push('/saved')
        }
      })
    }
  }

  if (houseError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading House</h1>
            <p className="text-gray-600 mb-4">{houseError}</p>
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

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">House Not Found</h1>
            <Button onClick={()=>router.push('/')} className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
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
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Houses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative">
                {houseImages.length > 0 ? (
                  <Image
                    src={houseImages[currentImageIndex]}
                    alt={house.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 flex flex-col items-center justify-center text-gray-500 rounded-lg">
                    <Home className="h-16 w-16 mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No images available</p>
                    <p className="text-sm text-gray-400">{house.title}</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleFavoriteClick}
                    className="cursor-pointer"
                  >
                      <Heart className={`h-4 w-4 ${isHouseFavorite(house.id, 'house') ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleShare}
                    className="cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {houseImages.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {houseImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1} of ${house.title}`}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-primary' : 'border-gray-200'
                      } cursor-pointer`}
                    >
                      <Image src={image} alt={`${house.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                    <div className="text-3xl font-bold text-primary">{formatPrice(house.price)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-1">{houseFeatures.bedrooms}</span>Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-1">{houseFeatures.bathrooms}</span>Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-1">{houseFeatures.area}m²</span>Area</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{house.description || 'No description available'}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {houseFeatures.amenities.length > 0 ? houseFeatures.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    )) : (
                      <p className="text-gray-500 col-span-2">No amenities listed</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Property Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-gray-700">Year Built: {houseFeatures.yearBuilt}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-gray-700">Security: 24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {house.owner?.full_name?.charAt(0) || 'O'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{house.owner?.full_name || 'Property Owner'}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      4.5
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleContactAgent}
                    className={`w-full cursor-pointer`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {!user ? "Login to Contact" : "Call Owner"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSendMessage}
                    className={`w-full cursor-pointer`}
                    >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {!user ? "Login to Message" : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                    <span className="font-medium">{houseFeatures.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium">{houseFeatures.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area</span>
                    <span className="font-medium">{houseFeatures.area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">{houseFeatures.yearBuilt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {isInquiryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Send Inquiry</h3>
                  <p className="text-sm text-gray-600">Send a message to the property owner</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseInquiryModal}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Hi, I'm interested in this property. Could you please provide more information about..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {inquiryMessage.length}/500 characters
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCloseInquiryModal}
                    className="flex-1 cursor-pointer"
                    disabled={isSubmittingInquiry}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitInquiry}
                    className="flex-1 cursor-pointer"
                    disabled={isSubmittingInquiry || !inquiryMessage.trim()}
                  >
                    {isSubmittingInquiry ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        title={house?.title || 'Property'}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        description={house?.description || `Check out this ${house?.type?.toLowerCase()} property in ${house?.location}`}
      />
    </div>
  )
}
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HouseCard } from '@/components/listings/HouseCard'
import { EditHouseModal } from '@/components/listings/EditHouseModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingPage } from '@/components/ui/loading'
import { useActiveHouses } from '@/hooks/useApi'
import { Search, MapPin } from 'lucide-react'
import { House } from '@/lib/api/config'


export default function HousesPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [propertyType, setPropertyType] = useState('all')
  const [location] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [filteredHouses, setFilteredHouses] = useState<House[] | []>([])
  const [editingHouse, setEditingHouse] = useState<House | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const itemsPerPage = 6
  const { houses, loading: housesLoading, error: housesError } = useActiveHouses(currentPage, itemsPerPage)

  // Remove authentication requirement - make page publicly accessible
  // useEffect(() => {
  //   if (!authLoading && !user) {
  //     router.push('/')
  //   }
  // }, [user, authLoading, router])

  useEffect(() => {
    let filtered = houses

    if (searchTerm) {
      filtered = filtered.filter(house =>
        house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter(house => {
        const price = parseFloat(house.price) || 0;
        switch (priceRange) {
          case 'under-5m':
            return price < 5000000
          case '5m-10m':
            return price >= 5000000 && price < 10000000
          case '10m-20m':
            return price >= 10000000 && price < 20000000
          case 'over-20m':
            return price >= 20000000
          default:
            return true
        }
      })
    }

    // Property type filter
    if (propertyType !== 'all') {
      filtered = filtered.filter(house => house.type.toLowerCase() === propertyType.toLowerCase())
    }

    // Location filter
    if (location !== 'all') {
      filtered = filtered.filter(house => 
        house.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
    }

    setFilteredHouses(filtered.filter((house) => house.status === "active"))
    setCurrentPage(1)
  }, [houses, searchTerm, priceRange, propertyType, location, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentHouses = filteredHouses.slice(startIndex, endIndex)

  const handleHouseClick = (houseId: string) => {
    router.push(`/houses/${houseId}`)
  }

  const handleEditHouse = (house: House) => {
    setEditingHouse(house)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    // Force a page refresh to get updated data
    window.location.reload()
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingHouse(null)
  }

  if (housesLoading) {
    return <LoadingPage />
  }

  if (housesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Houses</h2>
          <p className="text-gray-600">{housesError}</p>
          <Button variant="outline" onClick={() => router.push('/')} className='mt-4 text-white bg-primary cursor-pointer'>Go to Home</Button>
       
        </div>
      </div>
    )
  }

  // Remove user check - allow public access
  // if (!user) {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Home</h1>
          <p className="text-gray-600">Discover the perfect property for you and your family</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
            <div className="flex flex-col gap-1">
            <label htmlFor="search" className='block'>Search</label>
              
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by title, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            {/* Price Range */}
            <div className="flex flex-col gap-1">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <label htmlFor="priceRange" className='block'>Price Range</label>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-5m">Under 5M ETB</SelectItem>
                <SelectItem value="5m-10m">5M - 10M ETB</SelectItem>
                <SelectItem value="10m-20m">10M - 20M ETB</SelectItem>
                <SelectItem value="over-20m">Over 20M ETB</SelectItem>
              </SelectContent>
            </Select>
            </div>
            {/* Property Type */}
            <div className="flex flex-col gap-1">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <label htmlFor="propertyType" className='block'>Property Type</label>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
            </div>
            {/* Sort */}
            <div className="flex flex-col gap-1">
  <Select value={sortBy} onValueChange={setSortBy}>
    
  <label htmlFor="sortBy" className='block'>Sort By</label>
    <SelectTrigger>
      <SelectValue placeholder="Sort By" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="newest">Newest First</SelectItem>
      <SelectItem value="oldest">Oldest First</SelectItem>
      <SelectItem value="price-low">Price: Low to High</SelectItem>
      <SelectItem value="price-high">Price: High to Low</SelectItem>
    </SelectContent>
  </Select>
</div>

          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredHouses.length)} of {filteredHouses.length} properties
          </p>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentHouses.map((house) => {

  return (
    <div
      key={house.id}
      onClick={() => handleHouseClick(house.id)}
      className={`cursor-pointer`}
    >
      <HouseCard house={house} onEdit={handleEditHouse} />
    </div>
  );
})}

        </div>

        {/* No Results */}
        {filteredHouses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="cursor-pointer"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}

        <EditHouseModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          house={editingHouse}
          onSuccess={handleEditSuccess}
        />
      </div>

      <Footer />
    </div>
  )
}
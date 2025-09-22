"use client"

import { useState, useEffect } from 'react'
import { HouseCard } from '@/components/listings/HouseCard'
import { EditHouseModal } from '@/components/listings/EditHouseModal'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useHouses } from '@/hooks/useApi'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { House } from '@/lib/api/config'

export function HouseListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState('all')
  const [propertyType, setPropertyType] = useState('all')
  const [bedrooms, setBedrooms] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredHouses, setFilteredHouses] = useState<House[]>([])
  const [editingHouse, setEditingHouse] = useState<House | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const itemsPerPage = 6
  const { houses, loading, error, total, totalPages } = useHouses(currentPage, itemsPerPage)
  
  useEffect(() => {
    let filtered = houses

    if (searchQuery) {
      filtered = filtered.filter(house =>
        house.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter(house => {
        const price = parseFloat(house.price) || 0
        switch (priceRange) {
          case 'under-5m':
            return price < 5000000
          case '5m-10m':
            return price >= 5000000 && price <= 10000000
          case '10m-20m':
            return price > 10000000 && price <= 20000000
          case 'over-20m':
            return price > 20000000
          default:
            return true
        }
      })
    }

    if (propertyType !== 'all') {
      filtered = filtered.filter(house => house.type === propertyType)
    }

    if (bedrooms !== 'all') {
      filtered = filtered.filter(house => {
        try {
          const features = JSON.parse(house.features || '{}');
          return features.bedrooms?.toString() === bedrooms;
        } catch {
          return false;
        }
      })
    }

    setFilteredHouses(filtered)
  }, [houses, searchQuery, priceRange, propertyType, bedrooms])

  const handleEditHouse = (house: House) => {
    setEditingHouse(house)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    window.location.reload()
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingHouse(null)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex flex-col gap-1">
            <label htmlFor="search" className='block'>Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by location or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
          <Select value={priceRange} onValueChange={setPriceRange}>
            <label htmlFor="priceRange" className='block'>Price Range</label>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className='cursor-pointer'>All Prices</SelectItem>
              <SelectItem value="under-5m" className='cursor-pointer'>Under 5M ETB</SelectItem>
              <SelectItem value="5m-10m" className='cursor-pointer'>5M - 10M ETB</SelectItem>
              <SelectItem value="10m-20m" className='cursor-pointer'>10M - 20M ETB</SelectItem>
              <SelectItem value="over-20m" className='cursor-pointer'>Over 20M ETB</SelectItem>
            </SelectContent>
          </Select>
          
          </div>
          <div className="flex flex-col gap-1">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <label htmlFor="propertyType" className='block'>Property Type</label>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className='cursor-pointer'>All Types</SelectItem>
              <SelectItem value="villa" className='cursor-pointer'>Villa</SelectItem>
              <SelectItem value="apartment" className='cursor-pointer'>Apartment</SelectItem>
              <SelectItem value="house" className='cursor-pointer'>House</SelectItem>
              <SelectItem value="penthouse" className='cursor-pointer'>Penthouse</SelectItem>
              <SelectItem value="studio" className='cursor-pointer'>Studio</SelectItem>
              <SelectItem value="townhouse" className='cursor-pointer'>Townhouse</SelectItem>
            </SelectContent>
          </Select>
          </div>
          <div className="flex flex-col gap-1">
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <label htmlFor="bedrooms" className='block'>Bedrooms</label>
            <SelectTrigger className="w-full lg:w-32">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className='cursor-pointer'>All</SelectItem>
              <SelectItem value="1" className='cursor-pointer'>1+</SelectItem>
              <SelectItem value="2" className='cursor-pointer'>2+</SelectItem>
              <SelectItem value="3" className='cursor-pointer'>3+</SelectItem>
              <SelectItem value="4" className='cursor-pointer'>4+</SelectItem>
            </SelectContent>
          </Select>
          </div>
          </div>
      </div>
      
      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {loading ? '' : `Showing ${filteredHouses.length} of ${total} properties`}
        </p>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading houses...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading houses: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="cursor-pointer"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* House Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.length > 0 ? (
            filteredHouses.map((house) => (
              <HouseCard key={house.id} house={house} onEdit={handleEditHouse} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No houses found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="cursor-pointer"
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit House Modal */}
      <EditHouseModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        house={editingHouse}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
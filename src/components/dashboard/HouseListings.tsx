"use client"

import { useState } from 'react'
import { HouseCard } from '@/components/listings/HouseCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data
const mockHouses = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: 'Downtown, New York',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: '',
    type: 'apartment' as const,
    status: 'for-sale' as const,
  },
  {
    id: '2',
    title: 'Cozy Family House',
    price: 320000,
    location: 'Suburbs, California',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: '',
    type: 'house' as const,
    status: 'for-sale' as const,
  },
  {
    id: '3',
    title: 'Luxury Condo',
    price: 750000,
    location: 'Miami Beach, Florida',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    image: '',
    type: 'condo' as const,
    status: 'for-rent' as const,
  },
  {
    id: '4',
    title: 'Townhouse with Garden',
    price: 280000,
    location: 'Austin, Texas',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    image: '',
    type: 'townhouse' as const,
    status: 'for-sale' as const,
  },
  {
    id: '5',
    title: 'Studio Apartment',
    price: 180000,
    location: 'Seattle, Washington',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: '',
    type: 'apartment' as const,
    status: 'for-sale' as const,
  },
  {
    id: '6',
    title: 'Executive Penthouse',
    price: 1200000,
    location: 'Manhattan, New York',
    bedrooms: 4,
    bathrooms: 4,
    area: 3000,
    image: '',
    type: 'condo' as const,
    status: 'for-sale' as const,
  },
]

export function HouseListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState('all')
  const [propertyType, setPropertyType] = useState('all')
  const [bedrooms, setBedrooms] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const itemsPerPage = 6
  const totalPages = Math.ceil(mockHouses.length / itemsPerPage)
  
  const filteredHouses = mockHouses.filter(house => {
    const matchesSearch = house.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         house.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'under-300k' && house.price < 300000) ||
      (priceRange === '300k-500k' && house.price >= 300000 && house.price <= 500000) ||
      (priceRange === '500k-1m' && house.price > 500000 && house.price <= 1000000) ||
      (priceRange === 'over-1m' && house.price > 1000000)
    const matchesType = propertyType === 'all' || house.type === propertyType
    const matchesBedrooms = bedrooms === 'all' || house.bedrooms.toString() === bedrooms
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms
  })
  
  const paginatedHouses = filteredHouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
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
          
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-300k">Under $300K</SelectItem>
              <SelectItem value="300k-500k">$300K - $500K</SelectItem>
              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
              <SelectItem value="over-1m">Over $1M</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="w-full lg:w-32">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {paginatedHouses.length} of {filteredHouses.length} properties
        </p>
      </div>
      
      {/* House Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedHouses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
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
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
    </div>
  )
}
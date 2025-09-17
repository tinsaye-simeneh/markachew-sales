"use client"

import { useState } from 'react'
import { HouseCard } from '@/components/listings/HouseCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { sampleHouses } from '@/data/sampleData'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export function HouseListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState('all')
  const [propertyType, setPropertyType] = useState('all')
  const [bedrooms, setBedrooms] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const itemsPerPage = 6
  const totalPages = Math.ceil(sampleHouses.length / itemsPerPage)
  
  const filteredHouses = sampleHouses.filter(house => {
    const matchesSearch = house.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         house.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'under-5m' && house.price < 5000000) ||
      (priceRange === '5m-10m' && house.price >= 5000000 && house.price <= 10000000) ||
      (priceRange === '10m-20m' && house.price > 10000000 && house.price <= 20000000) ||
      (priceRange === 'over-20m' && house.price > 20000000)
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
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-5m">Under 5M ETB</SelectItem>
              <SelectItem value="5m-10m">5M - 10M ETB</SelectItem>
              <SelectItem value="10m-20m">10M - 20M ETB</SelectItem>
              <SelectItem value="over-20m">Over 20M ETB</SelectItem>
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
          <div className="flex flex-col gap-1">
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <label htmlFor="bedrooms" className='block'>Bedrooms</label>
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
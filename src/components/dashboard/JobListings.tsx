"use client"

import { useState } from 'react'
import { JobCard } from '@/components/listings/JobCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { sampleJobs } from '@/data/sampleData'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export function JobListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const [jobType, setJobType] = useState('all')
  const [experience, setExperience] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const itemsPerPage = 6
  const totalPages = Math.ceil(sampleJobs.length / itemsPerPage)
  
  const filteredJobs = sampleJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = jobType === 'all' || job.type.toLowerCase() === jobType.toLowerCase()
    const matchesExperience = experience === 'all' || job.experience.toLowerCase() === experience.toLowerCase()
    
    return matchesSearch && matchesType && matchesExperience
  })
  
  const paginatedJobs = filteredJobs.slice(
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
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full Time</SelectItem>
              <SelectItem value="Part-time">Part Time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1-2 years">1-2 years</SelectItem>
              <SelectItem value="2-3 years">2-3 years</SelectItem>
              <SelectItem value="3-5 years">3-5 years</SelectItem>
              <SelectItem value="5+ years">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {paginatedJobs.length} of {filteredJobs.length} jobs
        </p>
      </div>
      
      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
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
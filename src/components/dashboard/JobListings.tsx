"use client"

import { useState, useEffect } from 'react'
import { JobCard } from '@/components/listings/JobCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useJobs } from '@/hooks/useApi'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

export function JobListings() {
  const [currentPage, setCurrentPage] = useState(1)
  const [jobType, setJobType] = useState('all')
  const [experience, setExperience] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  
  const itemsPerPage = 6
  const { jobs, loading, error, total, totalPages } = useJobs(currentPage, itemsPerPage)
  
  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Job type filter - Note: API doesn't have job type field, so we'll skip this filter
    // if (jobType !== 'all') {
    //   filtered = filtered.filter(job => job.type?.toLowerCase() === jobType.toLowerCase())
    // }

    // Experience filter - Parse requirements JSON string
    if (experience !== 'all') {
      filtered = filtered.filter(job => {
        try {
          const requirements = JSON.parse(job.requirements || '{}');
          return requirements.experience?.toLowerCase() === experience.toLowerCase();
        } catch {
          return false;
        }
      })
    }

    setFilteredJobs(filtered)
  }, [jobs, searchQuery, jobType, experience])

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
          {loading ? 'Loading...' : `Showing ${filteredJobs.length} of ${total} jobs`}
        </p>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#007a7f]" />
          <span className="ml-2 text-gray-600">Loading jobs...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="cursor-pointer"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* Job Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No jobs found matching your criteria.</p>
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
    </div>
  )
}
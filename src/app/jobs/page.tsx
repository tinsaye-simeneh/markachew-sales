"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/listings/JobCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingPage } from '@/components/ui/loading'
import { useJobs } from '@/hooks/useApi'
import { Search, Briefcase } from 'lucide-react'
import { Job } from '@/lib/api'

export default function JobsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [jobType, setJobType] = useState('all')
  const [category, setCategory] = useState('all')
  const [experience] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])

  const itemsPerPage = 6
  const { jobs, loading: jobsLoading, error: jobsError } = useJobs(currentPage, itemsPerPage)


  const getJobDetails = (job: Job) => {
    if (Array.isArray(job.requirements)) {
      return {
        experience: job.requirements[0] || 'Experience Not specified',
        type: job.requirements[1] || 'Type Not specified',
        location: job.requirements[2] || 'Location Not specified',
        salary: job.requirements[3] || 'Salary Not specified'
      };
    } else {
      try {
        const requirements = JSON.parse(job.requirements as string || '{}');
        return {
          experience: requirements.experience || 'Experience Not specified',
          type: requirements.type || 'Type Not specified',
          location: requirements.location || 'Location Not specified',
          salary: requirements.salary || 'Salary Not specified'
        };
      } catch {
        return {
          experience: 'Experience Not specified',
          type: 'Type Not specified',
          location: 'Location Not specified',
          salary: 'Salary Not specified'
        };
      }
    }
  };

  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(job => {
        const jobDetails = getJobDetails(job);
        return job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               jobDetails.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
               jobDetails.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
               jobDetails.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
               job.employer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    if (jobType !== 'all') {
      filtered = filtered.filter(job => {
        if (Array.isArray(job.requirements)) {
          return job.requirements.some(req => 
            req.toLowerCase().includes(jobType.toLowerCase())
          );
        } else {
          const jobDetails = getJobDetails(job);
          return jobDetails.type.toLowerCase() === jobType.toLowerCase()
        }
      })
    }

    if (category !== 'all') {
      filtered = filtered.filter(job => {
        const jobText = (job.title + ' ' + job.description).toLowerCase();
        return jobText.includes(category.toLowerCase())
      })
    }

    if (experience !== 'all') {
      filtered = filtered.filter(job => {
        if (Array.isArray(job.requirements)) {
          return job.requirements.some(req => {
            const reqLower = req.toLowerCase();
            switch (experience) {
              case 'entry':
                return reqLower.includes('1') || reqLower.includes('0-1') || reqLower.includes('entry')
              case 'mid':
                return reqLower.includes('2-3') || reqLower.includes('3-4') || reqLower.includes('mid')
              case 'senior':
                return reqLower.includes('3-5') || reqLower.includes('5+') || reqLower.includes('senior')
              default:
                return true
            }
          });
        } else {
          const jobDetails = getJobDetails(job);
          switch (experience) {
            case 'entry':
              return jobDetails.experience.includes('1') || jobDetails.experience.includes('0-1')
            case 'mid':
              return jobDetails.experience.includes('2-3') || jobDetails.experience.includes('3-4')
            case 'senior':
              return jobDetails.experience.includes('3-5') || jobDetails.experience.includes('5+')
            default:
              return true
          }
        }
      })
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'salary-high':
        filtered.sort((a, b) => {
          const aDetails = getJobDetails(a);
          const bDetails = getJobDetails(b);
          const aSalary = parseInt(aDetails.salary.replace(/[^\d]/g, '')) || 0
          const bSalary = parseInt(bDetails.salary.replace(/[^\d]/g, '')) || 0
          return bSalary - aSalary
        })
        break
      case 'salary-low':
        filtered.sort((a, b) => {
          const aDetails = getJobDetails(a);
          const bDetails = getJobDetails(b);
          const aSalary = parseInt(aDetails.salary.replace(/[^\d]/g, '')) || 0
          const bSalary = parseInt(bDetails.salary.replace(/[^\d]/g, '')) || 0
          return aSalary - bSalary
        })
        break
    }

    setFilteredJobs(filtered.filter((job: Job) => 
      job.status === 'ACTIVE' || 
      job.status === 'active' || 
      job.status === 'PENDING'
    ))
    setCurrentPage(1)
  }, [jobs, searchTerm, jobType, category, experience, sortBy])

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  if (jobsLoading) {
    return <LoadingPage />
  }

  if (jobsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Jobs</h2>
          <p className="text-gray-600">{jobsError}</p>
          <Button variant="outline" onClick={() => router.push('/')} className='mt-4 text-white bg-primary cursor-pointer'>Go to Home</Button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Career</h1>
          <p className="text-gray-600">Discover exciting job opportunities that match your skills and aspirations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
            <div className="flex flex-col gap-1">
            <label htmlFor="search" className='block'>Search</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>


        <div className="flex flex-col gap-1">
            <Select value={category} onValueChange={setCategory}>
              <label htmlFor="category" className='block'>Category</label>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="human resources">Human Resources</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>
            </div>

            <div className="flex flex-col gap-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <label htmlFor="sortBy" className='block'>Sort By</label>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                <SelectItem value="salary-low">Salary: Low to High</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentJobs.map((job: Job) => (
            <div key={job.id} onClick={() => handleJobClick(job.id)} className="cursor-pointer">
              <JobCard job={job} onEdit={undefined} />
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

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
      </div>

      <Footer />
    </div>
  )
}
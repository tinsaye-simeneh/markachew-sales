"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/listings/JobCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Briefcase, MapPin, Clock, DollarSign } from 'lucide-react'

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Solutions Ethiopia",
    location: "Addis Ababa, Ethiopia",
    salary: "80,000 - 120,000 ETB",
    type: "Full-time",
    experience: "3-5 years",
    description: "We are looking for a senior software engineer to join our growing team...",
    requirements: ["React", "Node.js", "TypeScript", "AWS"],
    benefits: ["Health Insurance", "Remote Work", "Learning Budget"],
    postedDate: "2024-01-15",
    category: "Technology"
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Digital Marketing Pro",
    location: "Addis Ababa, Ethiopia",
    salary: "60,000 - 90,000 ETB",
    type: "Full-time",
    experience: "2-4 years",
    description: "Lead our marketing initiatives and drive brand awareness...",
    requirements: ["Digital Marketing", "Social Media", "Analytics", "Content Creation"],
    benefits: ["Flexible Hours", "Performance Bonus", "Career Growth"],
    postedDate: "2024-01-14",
    category: "Marketing"
  },
  {
    id: 3,
    title: "Financial Analyst",
    company: "Ethiopian Investment Group",
    location: "Addis Ababa, Ethiopia",
    salary: "70,000 - 100,000 ETB",
    type: "Full-time",
    experience: "2-3 years",
    description: "Analyze financial data and provide insights for business decisions...",
    requirements: ["Excel", "Financial Modeling", "Data Analysis", "CPA Preferred"],
    benefits: ["Health Insurance", "Retirement Plan", "Professional Development"],
    postedDate: "2024-01-13",
    category: "Finance"
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "Addis Ababa, Ethiopia",
    salary: "50,000 - 80,000 ETB",
    type: "Full-time",
    experience: "1-3 years",
    description: "Create beautiful and intuitive user experiences for our products...",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    benefits: ["Creative Freedom", "Remote Work", "Design Tools"],
    postedDate: "2024-01-12",
    category: "Design"
  },
  {
    id: 5,
    title: "Sales Representative",
    company: "Ethiopian Trading Company",
    location: "Addis Ababa, Ethiopia",
    salary: "40,000 - 70,000 ETB + Commission",
    type: "Full-time",
    experience: "1-2 years",
    description: "Build relationships with clients and drive sales growth...",
    requirements: ["Sales Experience", "Communication Skills", "CRM Software"],
    benefits: ["Commission", "Company Car", "Sales Training"],
    postedDate: "2024-01-11",
    category: "Sales"
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AI Innovation Hub",
    location: "Addis Ababa, Ethiopia",
    salary: "90,000 - 130,000 ETB",
    type: "Full-time",
    experience: "3-5 years",
    description: "Extract insights from data to drive business intelligence...",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    benefits: ["Research Opportunities", "Conference Attendance", "Stock Options"],
    postedDate: "2024-01-10",
    category: "Technology"
  },
  {
    id: 7,
    title: "Human Resources Specialist",
    company: "People First Consulting",
    location: "Addis Ababa, Ethiopia",
    salary: "45,000 - 65,000 ETB",
    type: "Full-time",
    experience: "2-3 years",
    description: "Manage recruitment, employee relations, and HR processes...",
    requirements: ["HR Experience", "Recruitment", "Employee Relations", "HRIS"],
    benefits: ["Health Insurance", "Professional Development", "Work-Life Balance"],
    postedDate: "2024-01-09",
    category: "Human Resources"
  },
  {
    id: 8,
    title: "Content Writer",
    company: "Digital Content Agency",
    location: "Remote",
    salary: "30,000 - 50,000 ETB",
    type: "Part-time",
    experience: "1-2 years",
    description: "Create engaging content for various digital platforms...",
    requirements: ["Writing Skills", "SEO Knowledge", "Content Management", "Research"],
    benefits: ["Remote Work", "Flexible Schedule", "Creative Projects"],
    postedDate: "2024-01-08",
    category: "Content"
  }
]

export default function JobsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState(sampleJobs)
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [jobType, setJobType] = useState('all')
  const [category, setCategory] = useState('all')
  const [experience, setExperience] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const itemsPerPage = 6

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Filter and search logic
  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Job type filter
    if (jobType !== 'all') {
      filtered = filtered.filter(job => job.type.toLowerCase() === jobType.toLowerCase())
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(job => job.category.toLowerCase() === category.toLowerCase())
    }

    // Experience filter
    if (experience !== 'all') {
      filtered = filtered.filter(job => {
        switch (experience) {
          case 'entry':
            return job.experience.includes('1') || job.experience.includes('0-1')
          case 'mid':
            return job.experience.includes('2-3') || job.experience.includes('3-4')
          case 'senior':
            return job.experience.includes('3-5') || job.experience.includes('5+')
          default:
            return true
        }
      })
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime())
        break
      case 'salary-high':
        filtered.sort((a, b) => {
          const aSalary = parseInt(a.salary.replace(/[^\d]/g, ''))
          const bSalary = parseInt(b.salary.replace(/[^\d]/g, ''))
          return bSalary - aSalary
        })
        break
      case 'salary-low':
        filtered.sort((a, b) => {
          const aSalary = parseInt(a.salary.replace(/[^\d]/g, ''))
          const bSalary = parseInt(b.salary.replace(/[^\d]/g, ''))
          return aSalary - bSalary
        })
        break
    }

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [jobs, searchTerm, jobType, category, experience, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  const handleJobClick = (jobId: number) => {
    router.push(`/jobs/${jobId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007a7f]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Career</h1>
          <p className="text-gray-600">Discover exciting job opportunities that match your skills and aspirations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
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

            {/* Job Type */}
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
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

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
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

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentJobs.map((job) => (
            <div key={job.id} onClick={() => handleJobClick(job.id)} className="cursor-pointer">
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
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
      </div>

      <Footer />
    </div>
  )
}
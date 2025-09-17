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
import { getJobById } from '@/data/sampleData'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  experience: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  category: string
  companyInfo: {
    size: string
    industry: string
    website: string
    description: string
  }
  responsibilities: string[]
}

export default function JobDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = parseInt(params.id as string)
  
  const [job, setJob] = useState<Job | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [openModal, setOpenModal] = useState(false) // modal state

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Find job data
  useEffect(() => {
    const foundJob = getJobById(jobId.toString())
    if (foundJob) {
      setJob(foundJob)
    }
  }, [jobId])

  const handleBack = () => {
    router.push('/jobs')
  }

  const handleApply = () => {
    // Set applied and open modal
    setHasApplied(true)
    setOpenModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <Button onClick={handleBack} className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
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
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">{job.category}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
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

                {/* Job Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{job.salary}</div>
                    <div className="text-sm text-gray-600">Salary</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{job.experience}</div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{formatDate(job.postedDate)}</div>
                    <div className="text-sm text-gray-600">Posted</div>
                  </div>
                </div>

                {/* Description, Responsibilities, Requirements, Benefits (unchanged) */}
                {/* ...copy your existing content here... */}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Button with Modal */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <Button 
                  onClick={handleApply}
                  disabled={hasApplied}
                  className="w-full mb-4 cursor-pointer"
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {hasApplied ? "Application submitted successfully!" : "Click to apply for this position"}
                </div>
              </CardContent>
            </Card>

            {/* Application Success Modal */}
            {openModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md relative">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Application Submitted</h3>
                      <p className="text-gray-700 mb-4">
                        Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> has been successfully submitted!
                      </p>
                      <Button 
                        onClick={() => setOpenModal(false)}
                        className="w-full cursor-pointer"
                      >
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Company Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About {job.company}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">{job.companyInfo.size}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">{job.companyInfo.industry}</span>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <a 
                      href={job.companyInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#007a7f] hover:underline cursor-pointer"
                    >
                      Company Website
                    </a>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{job.companyInfo.description}</p>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{formatDate(job.postedDate)}</span>
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
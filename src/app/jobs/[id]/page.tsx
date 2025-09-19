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
import { useJob } from '@/hooks/useApi'
import { applicationsService } from '@/lib/api/services'
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

export default function JobDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [openModal, setOpenModal] = useState(false) // modal state
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use API hook to fetch job data
  const { job, loading: jobLoading, error: jobError } = useJob(jobId)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  const handleBack = () => {
    router.push('/jobs')
  }

  const handleApply = () => {
    if (user?.user_type !== 'EMPLOYEE') {
      alert('Only employees can apply for jobs')
      return
    }
    setShowApplicationForm(true)
  }

  const handleSubmitApplication = async () => {
    if (!user?.id || !coverLetter.trim()) {
      alert('Please provide a cover letter')
      return
    }

    try {
      setIsSubmitting(true)
      await applicationsService.createApplication({
        user_id: user.id,
        job_id: jobId,
        cover_letter: coverLetter.trim()
      })
      
      setHasApplied(true)
      setShowApplicationForm(false)
      setOpenModal(true)
      setCoverLetter('')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Parse requirements to get job details
  const getJobDetails = () => {
    if (!job) return { experience: 'N/A', type: 'N/A', location: 'N/A', salary: 'N/A' };
    
    try {
      const requirements = JSON.parse(job.requirements || '{}');
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

  const jobDetails = getJobDetails();

  if (isLoading || jobLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  if (jobError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Job</h1>
            <p className="text-gray-600 mb-4">{jobError}</p>
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
                      {job.employer?.full_name || 'Unknown Company'}
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {jobDetails.location}
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{jobDetails.type}</Badge>
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
                    <div className="font-semibold">{jobDetails.salary}</div>
                    <div className="text-sm text-gray-600">Salary</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{jobDetails.experience}</div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{formatDate(job.createdAt)}</div>
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
                  disabled={hasApplied || job.status !== 'active' || user?.user_type !== 'EMPLOYEE'}
                  className="w-full mb-4 cursor-pointer"
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : user?.user_type !== 'EMPLOYEE' ? (
                    <>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Employees Only
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {hasApplied ? "Application submitted successfully!" : "Click to apply for this position"}
                </div>
              </CardContent>
            </Card>

            {/* Application Form Modal */}
            {showApplicationForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">Apply for {job?.title}</h3>
                      <p className="text-gray-600">
                        Apply to <strong>{job?.employer?.full_name}</strong>
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Letter *
                        </label>
                        <textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Write your cover letter here..."
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent resize-none"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Explain why you&apos;re interested in this position and how you&apos;re qualified.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowApplicationForm(false)
                          setCoverLetter('')
                        }}
                        className="flex-1 cursor-pointer"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitApplication}
                        className="flex-1 cursor-pointer"
                        disabled={isSubmitting || !coverLetter.trim()}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
                        Your application for <strong>{job?.title}</strong> at <strong>{job?.employer?.full_name}</strong> has been successfully submitted!
                      </p>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => setOpenModal(false)}
                          className="w-full cursor-pointer"
                        >
                          Close
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => router.push('/applications')}
                          className="w-full cursor-pointer"
                        >
                          View My Applications
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Company Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About {job.employer?.full_name}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">Company Size: Not specified</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">Industry: Not specified</span>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">Website: Not available</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">Company information not available.</p>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium">{jobDetails.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{jobDetails.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium">{jobDetails.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{jobDetails.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{formatDate(job.createdAt)}</span>
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
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { applicationsService } from '@/lib/api/services'
import { Application } from '@/lib/api/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingPage } from '@/components/ui/loading'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Calendar, FileText, Trash2, ExternalLink } from 'lucide-react'

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await applicationsService.getApplication(params.id)
      setApplication(response)
    } catch (err) {
      console.error('Error fetching application:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch application')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    if (user?.user_type !== 'EMPLOYEE') {
      router.push('/')
      return
    }

    fetchApplication()
  }, [user, router, fetchApplication])



  const handleDeleteApplication = async () => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }

    try {
      await applicationsService.deleteApplication(params.id)
      router.push('/applications')
    } catch (err) {
      console.error('Error deleting application:', err)
      alert('Failed to delete application')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <LoadingPage />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
            <p className="text-gray-600 mb-4">
              {error || 'The application you are looking for does not exist.'}
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.push('/applications')} className="cursor-pointer">
                Back to Applications
              </Button>
              <Button variant="outline" onClick={fetchApplication} className="cursor-pointer">
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/applications')}
            className="mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application #{application.id.slice(-8)}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Applied {formatDate(application.createdAt)}
                </div>
                {getStatusBadge(application.status)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/jobs/${application.job_id}`)}
                className="cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Job
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteApplication}
                className="cursor-pointer text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Application ID</label>
                  <p className="text-gray-900 font-mono text-sm">{application.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Applied Date</label>
                  <p className="text-gray-900">{formatDate(application.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(application.updatedAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/jobs/${application.job_id}`)}
                  className="w-full cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Job Posting
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/jobs')}
                  className="w-full cursor-pointer"
                >
                  Browse More Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
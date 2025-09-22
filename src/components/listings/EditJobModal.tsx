"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { jobsService } from '@/lib/api'
import { Job, CreateJobRequest } from '@/lib/api'
import { AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'

interface EditJobModalProps {
  isOpen: boolean
  onClose: () => void
  job: Job | null
  onSuccess: () => void
}

export function EditJobModal({ isOpen, onClose, job, onSuccess }: EditJobModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experience: '',
    type: '',
    location: '',
    salary: '',
    link: ''
  })

  // Initialize form data when job changes
  useEffect(() => {
    if (job) {
      try {
        const requirements = JSON.parse(job.requirements || '{}')
        setFormData({
          title: job.title || '',
          description: job.description || '',
          experience: requirements.experience || '',
          type: requirements.type || '',
          location: requirements.location || '',
          salary: requirements.salary || '',
          link: job.link || ''
        })
      } catch {
        setFormData({
          title: job.title || '',
          description: job.description || '',
          experience: '',
          type: '',
          location: '',
          salary: '',
          link: job.link || ''
        })
      }
    }
  }, [job])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job) return

    setLoading(true)
    setError('')

    try {
      const jobData: Partial<CreateJobRequest> = {
        title: formData.title,
        description: formData.description,
        requirements: {
          experience: formData.experience,
          type: formData.type,
          location: formData.location,
          salary: formData.salary
        },
        responsibility: {}, // Keep existing responsibility data
        link: formData.link || undefined
      }

      await jobsService.updateJob(job.id, jobData)
      
      toast.success("Job updated successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update job:', error)
      setError(error instanceof Error ? error.message : 'Failed to update job')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Edit Job</CardTitle>
              <CardDescription>
                Update the job details
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title" className='mb-2'>Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Software Developer"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className='mb-2'>Job Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the job role and responsibilities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className='mb-2'>Job Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience" className='mb-2'>Experience Level *</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 years">1-2 years</SelectItem>
                    <SelectItem value="2-3 years">2-3 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5+ years">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className='mb-2'>Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Addis Ababa, Ethiopia"
                  required
                />
              </div>

              <div>
                <Label htmlFor="salary" className='mb-2'>Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="e.g., 15,000 - 25,000 ETB"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="link" className='mb-2'>Application Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder="https://example.com/apply"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? 'Updating...' : 'Update Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
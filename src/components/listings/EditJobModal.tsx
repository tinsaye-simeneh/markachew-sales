"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { jobsService } from '@/lib/api'
import { Job, CreateJobRequest } from '@/lib/api'
import { AlertCircle, X, Plus, FileText, Target } from 'lucide-react'
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
  const [formData, setFormData] = useState<Partial<CreateJobRequest>>({
    title: '',
    description: '',
    link: '',
    status: 'ACTIVE'
  })
  
  const [requirements, setRequirements] = useState<string[]>([])
  const [responsibilities, setResponsibilities] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState('')
  const [newResponsibility, setNewResponsibility] = useState('')

  useEffect(() => {
    if (job) {
      
      try {
        let parsedRequirements: string[] = []
        if (Array.isArray(job.requirements)) {
          parsedRequirements = job.requirements
        } else if (typeof job.requirements === 'string') {
          parsedRequirements = JSON.parse(job.requirements || '[]')
        }

        let parsedResponsibilities: string[] = []
        if (Array.isArray(job.responsibility)) {
          parsedResponsibilities = job.responsibility
        } else if (typeof job.responsibility === 'string') {
          parsedResponsibilities = JSON.parse(job.responsibility || '[]')
        }
        
        
        const jobStatus = job.status || 'ACTIVE'
        
        setFormData({
          title: job.title || '',
          description: job.description || '',
          link: job.link || '',
          status: jobStatus as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'VERIFICATION'
        })
        
        
        
        setRequirements(parsedRequirements)
        setResponsibilities(parsedResponsibilities)
      } catch (error) {
        console.error('Error parsing job data:', error)
        setFormData({
          title: job.title || '',
          description: job.description || '',
          link: job.link || '',
          status: job.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'VERIFICATION' || 'ACTIVE'
        })
        setRequirements([])
        setResponsibilities([])
      }
    }
  }, [job])


  const handleInputChange = (field: keyof CreateJobRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements(prev => [...prev, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index))
  }

  const addResponsibility = () => {
    if (newResponsibility.trim() && !responsibilities.includes(newResponsibility.trim())) {
      setResponsibilities(prev => [...prev, newResponsibility.trim()])
      setNewResponsibility('')
    }
  }

  const removeResponsibility = (index: number) => {
    setResponsibilities(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: 'requirement' | 'responsibility') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (type === 'requirement') {
        addRequirement()
      } else {
        addResponsibility()
      }
    }
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
        requirements: requirements,
        responsibility: responsibilities,
        link: formData.link || undefined,
        status: formData.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'VERIFICATION'
      }

      await jobsService.updateJob(job.id, jobData)
      
      toast.success("Job updated successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to update job', {
        description: 'Failed to update job'
      })
      setError(error instanceof Error ? error.message : 'Failed to update job')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
                placeholder="Describe the role, company culture, and what makes this opportunity special..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="status" className='mb-2'>Status *</Label>
              <Select
                key={`status-${job?.id}-${formData.status}`}
                value={formData.status || 'ACTIVE'}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="VERIFICATION">Verification</SelectItem>
                </SelectContent>
              </Select>
              
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

            {/* Requirements Section */}
            <div>
              <Label className='mb-2 flex items-center gap-2'>
                <FileText className="h-4 w-4" />
                Job Requirements
              </Label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g., 3+ years of React experience"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'requirement')}
                />
                <Button
                  type="button"
                  onClick={addRequirement}
                  disabled={!newRequirement.trim()}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {requirements.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Requirements:</Label>
                  <div className="flex flex-wrap gap-2">
                    {requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{requirement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                          className="h-4 w-4 p-0 hover:bg-blue-200 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Responsibilities Section */}
            <div>
              <Label className='mb-2 flex items-center gap-2'>
                <Target className="h-4 w-4" />
                Job Responsibilities
              </Label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g., Develop and maintain web applications"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'responsibility')}
                />
                <Button
                  type="button"
                  onClick={addResponsibility}
                  disabled={!newResponsibility.trim()}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {responsibilities.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Responsibilities:</Label>
                  <div className="flex flex-wrap gap-2">
                    {responsibilities.map((responsibility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{responsibility}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResponsibility(index)}
                          className="h-4 w-4 p-0 hover:bg-green-200 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
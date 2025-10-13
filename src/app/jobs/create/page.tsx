"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { jobsService } from '@/lib/api'
import { CreateJobRequest } from '@/lib/api/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft,
  Briefcase,
  Link,
  CheckCircle,
  Upload,
  X,
  Loader2,
  Plus,
  FileText,
  Target
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

export default function CreateJobPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<Partial<CreateJobRequest>>({
    title: '',
    description: '',
    link: '',
    status: 'PENDING'
  })
  
  const [requirements, setRequirements] = useState<string[]>([])
  const [responsibilities, setResponsibilities] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState('')
  const [newResponsibility, setNewResponsibility] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleInputChange = (field: keyof CreateJobRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
  }

  const removeImage = () => {
    setImage(null)
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

  const validateForm = () => {
    if (!formData.title?.trim()) {
      setError('Job title is required')
      return false
    }
    if (!formData.description?.trim()) {
      setError('Job description is required')
      return false
    }
    if (requirements.length === 0) {
      setError('At least one requirement is required')
      return false
    }
    if (responsibilities.length === 0) {
      setError('At least one responsibility is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError(null)

    try {
      const jobData: CreateJobRequest = {
        title: formData.title!,
        description: formData.description!,
        requirements: requirements,
        responsibility: responsibilities,
        link: formData.link || undefined,
        status: formData.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'VERIFICATION',
        image: image || undefined
      }

      await jobsService.createJob(jobData)
      toast.success('Job created successfully!')
      router.push('/')
    } catch (err) {
      console.error('Job creation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job posting'
      setError(errorMessage)
      
      // Check for subscription-related errors
      if (errorMessage.includes('User profile not found') || errorMessage.includes('Profile not found')) {
        toast.error('Please check your subscription status')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job Posting</h1>
          <p className="text-gray-600">Post a job and start receiving applications from qualified candidates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Information
              </CardTitle>
              <CardDescription>
                Provide the essential details about the job position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                    disabled={user?.user_type !== 'ADMIN' && user?.user_type !== 'SUPER_ADMIN'}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Application Link (Optional)
                </Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://company.com/apply"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={6}
                  placeholder="Describe the role, company culture, and what makes this opportunity special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Requirements
              </CardTitle>
              <CardDescription>
                List the skills, qualifications, and experience required for this position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
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
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Job Responsibilities
              </CardTitle>
              <CardDescription>
                Outline the key duties and responsibilities for this role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
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
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Job Image (Optional)
              </CardTitle>
              <CardDescription>
                Upload an image to represent this job posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload image or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>

              {image && (
                <div className="relative max-w-xs">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Job preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Job...
                </div>
              ) : (
                'Create Job Posting'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
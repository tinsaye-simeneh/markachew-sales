"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Building, Heart, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Job, UserType } from '@/lib/api'

interface JobCardProps {
  job: Job
  onEdit?: (job: Job) => void
}

export function JobCard({ job, onEdit }: JobCardProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { user } = useAuth()
  
  const { toggleFavorite, isFavorite, loading } = useFavorites()

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isClient || loading) return
    
    await toggleFavorite(job.id, 'job')
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(job)
    }
  }

  const isEmployer = user?.user_type === UserType.EMPLOYER && user?.id === job.user_id

  const isJobFavorited = isClient ? isFavorite(job.id, 'job') : false

  const getExperienceColor = (exp: string) => {
    if (exp.includes('1-2')) return 'bg-green-100 text-green-800 hover:text-white'
    if (exp.includes('2-3')) return 'bg-blue-100 text-blue-800 hover:text-white'
    if (exp.includes('3-5')) return 'bg-purple-100 text-purple-800 hover:text-white'
    if (exp.includes('5+')) return 'bg-orange-100 text-orange-800 hover:text-white'
    return 'bg-gray-100 text-gray-800 hover:text-white'
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-blue-100 text-blue-800 hover:text-white'
      case 'part-time': return 'bg-green-100 text-green-800 hover:text-white'
      case 'contract': return 'bg-yellow-100 text-yellow-800 hover:text-white'
      case 'remote': return 'bg-purple-100 text-purple-800 hover:text-white'
      default: return 'bg-gray-100 text-gray-800 hover:text-white'
    }
  }

  const getJobDetails = () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let requirements: any = {};
    
    if (Array.isArray(job.requirements)) {
      requirements = {
        experience: job.requirements[0] || 'Experience Not specified',
        type: job.requirements[1] || 'Type Not specified',
        location: job.requirements[2] || 'Location Not specified',
        salary: job.requirements[3] || 'Salary Not specified'
      };
    } else {
      try {
        requirements = JSON.parse(job.requirements || '{}');
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
    
    return {
      experience: requirements.experience || 'Experience Not specified',
      type: requirements.type || 'Type Not specified',
      location: requirements.location || 'Location Not specified',
      salary: requirements.salary || 'Salary Not specified'
    };
  };

  const jobDetails = getJobDetails();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleJobClick(job.id)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1 cursor-pointer">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Building className="h-4 w-4 mr-1" />
              {job.employer?.full_name || 'Unknown Company'}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {jobDetails.location}
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            {isEmployer && (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={handleEditClick}
                title="Edit job"
              >
                <Edit className="h-4 w-4 text-blue-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-4 w-4 ${isJobFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getTypeColor(jobDetails.type)}>
            {jobDetails.type}
          </Badge>
          <Badge className={getExperienceColor(jobDetails.experience)}>
            {jobDetails.experience}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-1">
          {job.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-primary">
            {jobDetails.salary || 'Salary not specified'}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <Button className="w-full mt-4 cursor-pointer" variant="outline">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  )
}
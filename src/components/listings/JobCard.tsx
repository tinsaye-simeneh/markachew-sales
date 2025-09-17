"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Building, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Job } from '@/data/sampleData'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  
  // Always call the hook, but handle client-side logic inside
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isClient) return // Don't handle clicks during SSR
    
    if (isFavorite(job.id, 'job')) {
      removeFromFavorites(job.id, 'job')
    } else {
      addToFavorites(job, 'job')
    }
  }

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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleJobClick(job.id)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-[#007a7f] transition-colors mb-1 cursor-pointer">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Building className="h-4 w-4 mr-1" />
              {job.company}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 cursor-pointer"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isJobFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getTypeColor(job.type)}>
            {job.type}
          </Badge>
          <Badge className={getExperienceColor(job.experience)}>
            {job.experience}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-1">
          {job.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-[#007a7f]">
            {job.salary}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {job.postedDate}
          </div>
        </div>
        
        <Button className="w-full mt-4 cursor-pointer" variant="outline">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  )
}
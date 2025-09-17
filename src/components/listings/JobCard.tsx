"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Building, Heart } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  experience: 'entry' | 'mid' | 'senior' | 'executive'
  postedAt: string
  description: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getExperienceColor = (exp: string) => {
    switch (exp) {
      case 'entry': return 'bg-green-100 text-green-800'
      case 'mid': return 'bg-blue-100 text-blue-800'
      case 'senior': return 'bg-purple-100 text-purple-800'
      case 'executive': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800'
      case 'part-time': return 'bg-green-100 text-green-800'
      case 'contract': return 'bg-yellow-100 text-yellow-800'
      case 'remote': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-[#007a7f] transition-colors mb-1">
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
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getTypeColor(job.type)}>
            {job.type.replace('-', ' ')}
          </Badge>
          <Badge className={getExperienceColor(job.experience)}>
            {job.experience} level
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-green-600">
            {job.salary}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {job.postedAt}
          </div>
        </div>
        
        <Button className="w-full mt-4 cursor-pointer" variant="outline">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  )
}
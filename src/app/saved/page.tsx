"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useSavedItems } from '@/hooks/useSavedItems'
import { HouseCard } from '@/components/listings/HouseCard'
import { JobCard } from '@/components/listings/JobCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Heart, Home, Briefcase, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Job } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function SavedPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const { savedHouses, savedJobs, loading: savedLoading, error, refetch } = useSavedItems()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading || savedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={refetch}
              disabled={savedLoading}
              className="flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${savedLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-gray-600">Your favorite houses and jobs all in one place.</p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Home className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Saved Houses</h2>
            <span className="ml-3 px-3 py-1 bg-primary text-white text-sm rounded-full">
              {savedHouses.length}
            </span>
          </div>
          
          {savedHouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHouses.map((house) => (
                <HouseCard key={house.id} house={house} onEdit={undefined} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved houses yet</h3>
              <p className="text-gray-600 mb-4">Start browsing houses and save your favorites!</p>
              <button 
                onClick={() => router.push('/houses')}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-[#006066] transition-colors cursor-pointer"
              >
                Browse Houses
              </button>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center mb-6">
            <Briefcase className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Saved Jobs</h2>
            <span className="ml-3 px-3 py-1 bg-primary text-white text-sm rounded-full">
              {savedJobs.length}
            </span>
          </div>
          
          {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job: Job) => (
                <JobCard key={job.id} job={job} onEdit={undefined} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-600 mb-4">Start browsing jobs and save your favorites!</p>
              <button 
                onClick={() => router.push('/jobs')}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-[#006066] transition-colors cursor-pointer"
              >
                Browse Jobs
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
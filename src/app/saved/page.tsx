"use client"

import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { HouseCard } from '@/components/listings/HouseCard'
import { JobCard } from '@/components/listings/JobCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Heart, Home, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Job } from '@/lib/api'

export default function SavedPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  // Always call the hook, but handle client-side logic inside
  const { favoriteHouses, favoriteJobs } = useFavorites()

 

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007a7f]"></div>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
          </div>
          <p className="text-gray-600">Your favorite houses and jobs all in one place.</p>
        </div>

        {/* Saved Houses Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Home className="h-6 w-6 text-[#007a7f] mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Saved Houses</h2>
            <span className="ml-3 px-3 py-1 bg-[#007a7f] text-white text-sm rounded-full">
              {favoriteHouses.length}
            </span>
          </div>
          
          {favoriteHouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteHouses.map((house) => (
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
                className="bg-[#007a7f] text-white px-6 py-2 rounded-md hover:bg-[#006066] transition-colors"
              >
                Browse Houses
              </button>
            </div>
          )}
        </section>

        {/* Saved Jobs Section */}
        <section>
          <div className="flex items-center mb-6">
            <Briefcase className="h-6 w-6 text-[#007a7f] mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Saved Jobs</h2>
            <span className="ml-3 px-3 py-1 bg-[#007a7f] text-white text-sm rounded-full">
              {favoriteJobs.length}
            </span>
          </div>
          
          {favoriteJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteJobs.map((job: Job) => (
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
                className="bg-[#007a7f] text-white px-6 py-2 rounded-md hover:bg-[#006066] transition-colors"
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
"use client"

import { useState, useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { favoritesService } from '@/lib/api/favorites-service'
import { House, Job } from '@/lib/api/config'
import { toast } from 'sonner'

export function useSavedItems() {
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [savedHouses, setSavedHouses] = useState<House[]>([])
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSavedItems = async () => {
    if (favoritesLoading) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [houseFavorites, jobFavorites] = await Promise.all([
        favoritesService.getFavorites('HOUSE'),
        favoritesService.getFavorites('JOB')
      ])

      const houses: House[] = houseFavorites
        .filter(fav => fav.type === 'HOUSE' && fav.item)
        .map(fav => ({
          ...fav.item,
          type: 'SALES', 
          user_id: fav.user_id,
          category: fav.item.category || {},
          owner: fav.item.seller || {},
          price: fav.item.price || '0',
          location: fav.item.location || '',
          description: fav.item.description || '',
          bedrooms: fav.item.bedrooms || 0,
          bathrooms: fav.item.bathrooms || 0,
          area: fav.item.area || 0,
          images: fav.item.images || [],
          status: fav.item.status || 'active',
          seller_id: fav.item.seller_id || '',
          category_id: fav.item.category_id || '',
          createdAt: fav.createdAt,
          updatedAt: fav.createdAt,
        }))

      const jobs: Job[] = jobFavorites
        .filter(fav => fav.type === 'JOB' && fav.item)
        .map(fav => ({
          ...fav.item,
          type: 'JOB',
          user_id: fav.user_id,
          requirements: fav.item.requirements || [],
          responsibility: fav.item.responsibility || '',
          image: fav.item.image || '',
          employer: fav.item.employer || {},
          description: fav.item.description || '',
          location: fav.item.location || '',
          salary: fav.item.salary || '0',
          employment_type: fav.item.employment_type || 'FULL_TIME',
          experience_level: fav.item.experience_level || 'ENTRY',
          status: fav.item.status || 'active',
          employer_id: fav.item.employer_id || '',
          category_id: fav.item.category_id || '',
          createdAt: fav.createdAt,
          updatedAt: fav.createdAt,
        }))

      setSavedHouses(houses)
      setSavedJobs(jobs)

    } catch (error) {
      console.error('Error fetching saved items:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch saved items')
      toast.error('Failed to load saved items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedItems()
  }, [favoriteIds, favoritesLoading])

  return {
    savedHouses,
    savedJobs,
    loading: loading || favoritesLoading,
    error,
    refetch: fetchSavedItems
  }
}
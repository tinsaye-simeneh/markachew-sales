"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { House, Job } from '@/lib/api'
import { favoritesService } from '@/lib/api/favorites-service'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'

interface FavoritesContextType {
  favoriteHouses: House[]
  favoriteJobs: Job[]
  favoriteIds: Set<string>
  loading: boolean
  addToFavorites: (item: House | Job, type: 'house' | 'job') => Promise<void>
  removeFromFavorites: (itemId: string, type: 'house' | 'job') => Promise<void>
  toggleFavorite: (itemId: string, type: 'house' | 'job') => Promise<void>
  isFavorite: (itemId: string, type: 'house' | 'job') => boolean
  refreshFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteHouses, setFavoriteHouses] = useState<House[]>([])
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteHouses([])
      setFavoriteJobs([])
      setFavoriteIds(new Set())
      return
    }

    try {
      setLoading(true)
      const [houseFavorites, jobFavorites] = await Promise.all([
        favoritesService.getFavorites('HOUSE'),
        favoritesService.getFavorites('JOB')
      ])

      const houseIds = new Set(houseFavorites.map(fav => fav.favorite_id))
      const jobIds = new Set(jobFavorites.map(fav => fav.favorite_id))
      const allIds = new Set([...houseIds, ...jobIds])

      setFavoriteIds(allIds)
      setFavoriteHouses([]) 
      setFavoriteJobs([]) 
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [user])

  const addToFavorites = async (item: House | Job, type: 'house' | 'job') => {
    try {
      const apiType = type === 'house' ? 'HOUSE' : 'JOB'
      const result = await favoritesService.toggleFavorite({ type: apiType, favorite_id: item.id })
      
      if (result.isAdded) {
        setFavoriteIds(prev => new Set([...prev, item.id]))
        
        if (type === 'house') {
          setFavoriteHouses(prev => {
            if (!prev.find(house => house.id === item.id)) {
              return [...prev, item as House]
            }
            return prev
          })
        } else {
          setFavoriteJobs(prev => {
            if (!prev.find(job => job.id === item.id)) {
              return [...prev, item as Job]
            }
            return prev
          })
        }
        
        toast.success(`${type === 'house' ? 'House' : 'Job'} added to favorites`)
      } else {
        const addResult = await favoritesService.toggleFavorite({ type: apiType, favorite_id: item.id })
        
        if (addResult.isAdded) {
          setFavoriteIds(prev => new Set([...prev, item.id]))
          
          if (type === 'house') {
            setFavoriteHouses(prev => {
              if (!prev.find(house => house.id === item.id)) {
                return [...prev, item as House]
              }
              return prev
            })
          } else {
            setFavoriteJobs(prev => {
              if (!prev.find(job => job.id === item.id)) {
                return [...prev, item as Job]
              }
              return prev
            })
          }
          
          toast.success(`${type === 'house' ? 'House' : 'Job'} added to favorites`)
        } else {
          throw new Error('Failed to add to favorites')
        }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error('Failed to add to favorites')
    }
  }

  const removeFromFavorites = async (itemId: string, type: 'house' | 'job') => {
    try {
      const apiType = type === 'house' ? 'HOUSE' : 'JOB'
      const result = await favoritesService.toggleFavorite({ type: apiType, favorite_id: itemId })
      
      if (!result.isAdded) {
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
        
        if (type === 'house') {
          setFavoriteHouses(prev => prev.filter(house => house.id !== itemId))
        } else {
          setFavoriteJobs(prev => prev.filter(job => job.id !== itemId))
        }
        
        toast.success(`${type === 'house' ? 'House' : 'Job'} removed from favorites`)
      } else {
        const removeResult = await favoritesService.toggleFavorite({ type: apiType, favorite_id: itemId })
        
        if (!removeResult.isAdded) {
          setFavoriteIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(itemId)
            return newSet
          })
          
          if (type === 'house') {
            setFavoriteHouses(prev => prev.filter(house => house.id !== itemId))
          } else {
            setFavoriteJobs(prev => prev.filter(job => job.id !== itemId))
          }
          
          toast.success(`${type === 'house' ? 'House' : 'Job'} removed from favorites`)
        } else {
          throw new Error('Failed to remove from favorites')
        }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast.error('Failed to remove from favorites')
    }
  }

  const toggleFavorite = async (itemId: string, type: 'house' | 'job') => {
    try {
      const apiType = type === 'house' ? 'HOUSE' : 'JOB'
      const result = await favoritesService.toggleFavorite({ type: apiType, favorite_id: itemId })
      
      if (result.isAdded) {
        setFavoriteIds(prev => new Set([...prev, itemId]))
        toast.success(`${type === 'house' ? 'House' : 'Job'} added to favorites`)
      } else {
        setFavoriteIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
        
        if (type === 'house') {
          setFavoriteHouses(prev => prev.filter(house => house.id !== itemId))
        } else {
          setFavoriteJobs(prev => prev.filter(job => job.id !== itemId))
        }
        
        toast.success(`${type === 'house' ? 'House' : 'Job'} removed from favorites`)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const isFavorite = (itemId: string) => {
    return favoriteIds.has(itemId)
  }

  const refreshFavorites = async () => {
    await fetchFavorites()
  }

  return (
    <FavoritesContext.Provider value={{
      favoriteHouses,
      favoriteJobs,
      favoriteIds,
      loading,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      refreshFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
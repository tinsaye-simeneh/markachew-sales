"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { House, Job } from '@/lib/api'
import { toast } from 'sonner'

interface FavoritesContextType {
  favoriteHouses: House[]
  favoriteJobs: Job[]
  addToFavorites: (item: House | Job, type: 'house' | 'job') => void
  removeFromFavorites: (itemId: string, type: 'house' | 'job') => void
  isFavorite: (itemId: string, type: 'house' | 'job') => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteHouses, setFavoriteHouses] = useState<House[]>([])
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      try {
        const savedHouses = localStorage.getItem('favoriteHouses')
        const savedJobs = localStorage.getItem('favoriteJobs')
        
        if (savedHouses) {
          setFavoriteHouses(JSON.parse(savedHouses))
        }
        if (savedJobs) {
          setFavoriteJobs(JSON.parse(savedJobs))
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Error loading favorites from localStorage:', {
          description: 'Error loading favorites from localStorage'
        })
      }
    }
  }, [])

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem('favoriteHouses', JSON.stringify(favoriteHouses))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Error saving houses to localStorage:', {
          description: 'Error saving houses to localStorage'
        })
      }
    }
  }, [favoriteHouses, isClient])

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem('favoriteJobs', JSON.stringify(favoriteJobs))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Error saving jobs to localStorage:', {
          description: 'Error saving jobs to localStorage'
        })
      }
    }
  }, [favoriteJobs, isClient])

  const addToFavorites = (item: House | Job, type: 'house' | 'job') => {
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
  }

  const removeFromFavorites = (itemId: string, type: 'house' | 'job') => {
    if (type === 'house') {
      setFavoriteHouses(prev => prev.filter(house => house.id !== itemId))
    } else {
      setFavoriteJobs(prev => prev.filter(job => job.id !== itemId))
    }
  }

  const isFavorite = (itemId: string, type: 'house' | 'job') => {
    if (type === 'house') {
      return favoriteHouses.some(house => house.id === itemId)
    } else {
      return favoriteJobs.some(job => job.id === itemId)
    }
  }

  return (
    <FavoritesContext.Provider value={{
      favoriteHouses,
      favoriteJobs,
      addToFavorites,
      removeFromFavorites,
      isFavorite
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
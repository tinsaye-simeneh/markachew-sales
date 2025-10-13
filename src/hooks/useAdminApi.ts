"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { adminService, AdminStats, AdminUser, AdminJob, AdminHouse, AdminApplication, AdminActivity } from '@/lib/api/admin-services'
import { categoriesService } from '@/lib/api/services'
import { UserType, HouseType, Category } from '@/lib/api/config'

// Filter interfaces
interface AdminUserFilters {
  user_type?: string
  status?: string
  verification_status?: string
  search?: string
  page?: number
}

interface AdminJobFilters {
  status?: string
  search?: string
  page?: number
}

interface AdminHouseFilters {
  status?: string
  type?: string
  search?: string
  page?: number
}

interface AdminApplicationFilters {
  status?: string
  search?: string
  page?: number
}
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}

export function useAdminUsers(filters: AdminUserFilters = {}) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)])

  const fetchUsers = useCallback(async (newFilters = memoizedFilters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllUsers({ 
        user_type: newFilters.user_type as UserType,
      })
      setUsers(data.users)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [memoizedFilters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const refetchUsers = useCallback(async () => {
    await fetchUsers()
  }, [fetchUsers])

  const updateUser = async (userId: string, userData: Partial<AdminUser>) => {
    try {
      const updatedUser = await adminService.updateUser(userId, userData)
      setUsers(users.map(user => user.id === userId ? updatedUser : user))
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId)
      setUsers(users.filter(user => user.id !== userId))
      setTotal(total - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      throw err
    }
  }

  const suspendUser = async (userId: string, reason: string) => {
    try {
      const updatedUser = await adminService.suspendUser(userId, reason)
      setUsers(users.map(user => user.id === userId ? updatedUser : user))
      
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend user')
      throw err
    }
  }

  const activateUser = async (userId: string) => {
    try {
      const updatedUser = await adminService.activateUser(userId)
      setUsers(users.map(user => user.id === userId ? updatedUser : user))
      
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user')
      throw err
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const updatedUser = await adminService.toggleUserStatus(userId)
      setUsers(users.map(user => user.id === userId ? updatedUser : user))
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle user status')
      throw err
    }
  }

  return {
    users,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
    toggleUserStatus,
    refetchUsers,
  }
}

export function useAdminJobs(filters: AdminJobFilters = {}) {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)])

  const fetchJobs = useCallback(async (newFilters = memoizedFilters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllJobs({ 
        search: newFilters.search,
        page: 1
       })
      setJobs(data.jobs)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }, [memoizedFilters])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const updateJob = async (jobId: string, jobData: Partial<AdminJob>) => {
    try {
      const updatedJob = await adminService.updateJob(jobId, jobData)
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job')
      throw err
    }
  }

  const deleteJob = async (jobId: string) => {
    try {
      await adminService.deleteJob(jobId)
      setJobs(jobs.filter(job => job.id !== jobId))
      setTotal(total - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job')
      throw err
    }
  }

  const approveJob = async (jobId: string) => {
    try {
      const updatedJob = await adminService.approveJob(jobId)
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve job')
      throw err
    }
  }

  const rejectJob = async (jobId: string, reason: string) => {
    try {
      const updatedJob = await adminService.rejectJob(jobId, reason)
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject job')
      throw err
    }
  }

  const toggleJobStatus = async (jobId: string, status: string) => {
    try {
      const updatedJob = await adminService.toggleJobStatus(jobId, status)
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job))
      return updatedJob
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle job status')
      throw err
    }
  }

  return {
    jobs,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchJobs,
    updateJob,
    deleteJob,
    approveJob,
    rejectJob,
    toggleJobStatus,
  }
}

export function useAdminHouses(filters: AdminHouseFilters = {}) {
  const [houses, setHouses] = useState<AdminHouse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)])

  const fetchHouses = useCallback(async (newFilters = memoizedFilters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllHouses({ 
        type: newFilters.type as HouseType,
        search: newFilters.search,
        page: 1
       })
      setHouses(data.houses)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch houses')
    } finally {
      setLoading(false)
    }
  }, [memoizedFilters])

  useEffect(() => {
    fetchHouses()
  }, [fetchHouses])

  const updateHouse = async (houseId: string, houseData: Partial<AdminHouse>) => {
    try {
      const updatedHouse = await adminService.updateHouse(houseId, houseData)
      setHouses(houses.map(house => house.id === houseId ? updatedHouse : house))
      return updatedHouse
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update house')
      throw err
    }
  }

  const deleteHouse = async (houseId: string) => {
    try {
      await adminService.deleteHouse(houseId)
      setHouses(houses.filter(house => house.id !== houseId))
      setTotal(total - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete house')
      throw err
    }
  }

  const approveHouse = async (houseId: string) => {
    try {
      const updatedHouse = await adminService.approveHouse(houseId)
      setHouses(houses.map(house => house.id === houseId ? updatedHouse : house))
      return updatedHouse
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve house')
      throw err
    }
  }

  const rejectHouse = async (houseId: string, reason: string) => {
    try {
      const updatedHouse = await adminService.rejectHouse(houseId, reason)
      setHouses(houses.map(house => house.id === houseId ? updatedHouse : house))
      return updatedHouse
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject house')
      throw err
    }
  }

  return {
    houses,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchHouses,
    updateHouse,
    deleteHouse,
    approveHouse,
    rejectHouse,
  }
}

export function useAdminApplications(filters: AdminApplicationFilters = {}) {
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
          const data = await adminService.getAllApplications({
          
          page: 1
       })
      setApplications(data.applications)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const updateApplication = async (applicationId: string, applicationData: Partial<AdminApplication>) => {
    try {
      const updatedApplication = await adminService.updateApplication(applicationId, applicationData)
      setApplications(applications.map(app => app.id === applicationId ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application')
      throw err
    }
  }

  const deleteApplication = async (applicationId: string) => {
    try {
      await adminService.deleteApplication(applicationId)
      setApplications(applications.filter(app => app.id !== applicationId))
      setTotal(total - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application')
      throw err
    }
  }

  return {
    applications,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchApplications,
    updateApplication,
    deleteApplication,
  }
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useAdminActivityLog(filters: { page?: number } = {}) {
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getActivityLog()
      setActivities(data.activities)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    total,
    page,
    totalPages,
    loading,
    error,
    refetch: fetchActivities,
  }
}

export function useSystemStatus() {
  const [status, setStatus] = useState<{ status: string; uptime: number; version: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getSystemStatus()
      setStatus({
        status: data.api_status,
        uptime: data.storage_usage,
        version: data.last_backup
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return { status, loading, error, refetch: fetchStatus }
}

// Category hooks
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriesService.getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, refetch: fetchCategories }
}

export function useCreateCategory() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCategory = async (categoryData: { name: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoriesService.createCategory(categoryData)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createCategory, loading, error }
}

export function useUpdateCategory() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateCategory = async (categoryId: string, categoryData: { name: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoriesService.updateCategory(categoryId, categoryData)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateCategory, loading, error }
}

export function useDeleteCategory() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteCategory = async (categoryId: string) => {
    try {
      setLoading(true)
      setError(null)
      await categoriesService.deleteCategory(categoryId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteCategory, loading, error }
}
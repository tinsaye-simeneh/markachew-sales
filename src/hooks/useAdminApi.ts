"use client"

import { useState, useEffect } from 'react'
import { adminService, AdminStats, AdminUser, AdminJob, AdminHouse, AdminApplication, AdminActivity } from '@/lib/api/admin-services'

// Dashboard Stats Hook
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

// Users Management Hook
export function useAdminUsers(filters: any = {}) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async (pageNum = 1, newFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllUsers({ ...newFilters, page: pageNum })
      setUsers(data.users)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [JSON.stringify(filters)])

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
  }
}

// Jobs Management Hook
export function useAdminJobs(filters: any = {}) {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async (pageNum = 1, newFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllJobs({ ...newFilters, page: pageNum })
      setJobs(data.jobs)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [JSON.stringify(filters)])

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
  }
}

// Houses Management Hook
export function useAdminHouses(filters: any = {}) {
  const [houses, setHouses] = useState<AdminHouse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHouses = async (pageNum = 1, newFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllHouses({ ...newFilters, page: pageNum })
      setHouses(data.houses)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch houses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHouses()
  }, [JSON.stringify(filters)])

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

// Applications Management Hook
export function useAdminApplications(filters: any = {}) {
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = async (pageNum = 1, newFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getAllApplications({ ...newFilters, page: pageNum })
      setApplications(data.applications)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [JSON.stringify(filters)])

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

// Activity Log Hook
export function useAdminActivityLog(filters: any = {}) {
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async (pageNum = 1, newFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getActivityLog({ ...newFilters, page: pageNum })
      setActivities(data.activities)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [JSON.stringify(filters)])

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

// System Status Hook
export function useSystemStatus() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminService.getSystemStatus()
      setStatus(data)
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
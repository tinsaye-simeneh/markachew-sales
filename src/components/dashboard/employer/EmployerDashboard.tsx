"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '../DashboardSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useEmployerJobs, useDeleteJob, useEmployerApplications } from '@/hooks/useApi'
import { Job, UserType } from '@/lib/api'
import { EditJobModal } from '@/components/listings/EditJobModal'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { EmployerOverview } from './EmployerOverview'
import { EmployerJobs } from './EmployerJobs'
import { EmployerApplications } from './EmployerApplications'
import { EmployerNotifications } from './EmployerNotifications'
import { EmployerSettings } from './EmployerSettings'
import { PaymentPage } from '@/components/payments/PaymentPage'
import { SubscriptionManagement } from '../SubscriptionManagement'
import { toast } from 'sonner'

export function EmployerDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })
  
  const { jobs: myJobs, loading, refetch } = useEmployerJobs(user?.id)
  const { deleteJob } = useDeleteJob()
  const { applications, loading: applicationsLoading } = useEmployerApplications()
  

  const dashboardData = useMemo(() => {
    if (loading || !myJobs) {
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalViews: 0,
        recentJobs: [],
        totalApplications: 0,
        pendingApplications: 0
      }
    }

    return {
      totalJobs: myJobs.length,
      activeJobs: myJobs.filter(job => job.status === 'ACTIVE').length, 
      totalViews: 0, 
      recentJobs: myJobs.slice(0, 3),
      totalApplications: applications?.length || 0,
      pendingApplications: applications?.filter(app => app.status === 'PENDING').length || 0
    }
  }, [myJobs, applications, loading, applicationsLoading])

  const { totalJobs, activeJobs, totalViews, totalApplications, pendingApplications } = dashboardData

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    refetch() 
    setIsEditModalOpen(false)
    setEditingJob(null)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingJob(null)
  }

  const handleCreateJob = () => {
    router.push('/jobs/create')
  }


  const handleRefresh = () => {
    refetch()
  }

  const handleDeleteJob = async (jobId: string) => {
    const job = myJobs?.find(j => j.id === jobId)
    const jobTitle = job?.title || 'this job'
    
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Job',
      message: `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteJob(jobId)
          refetch()
          toast.success('Job deleted successfully')
          setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        } catch (error) {
          console.error('Failed to delete job:', error)
          toast.error('Failed to delete job')
          setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        }
      }
    })
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <EmployerOverview
            user={user}
            totalJobs={totalJobs}
            activeJobs={activeJobs}
            totalViews={totalViews}
            recentJobs={myJobs.filter(job => new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).slice(0, 3)}
            loading={loading || applicationsLoading}
            onEditJob={handleEditJob}
            onCreateJob={handleCreateJob}
            onDeleteJob={handleDeleteJob}
            totalApplications={totalApplications}
            pendingApplications={pendingApplications}
          />
        )

      case 'jobs':
        return (
          <EmployerJobs
            myJobs={myJobs}
            onEditJob={handleEditJob}
            onCreateJob={handleCreateJob}
            onRefresh={handleRefresh}
            onDeleteJob={handleDeleteJob}
          />
        )

     
      case 'applications':
        return <EmployerApplications />

      case 'payments':
        return <PaymentPage />

      case 'subscription':
        return <SubscriptionManagement />

      case 'notifications':
        return <EmployerNotifications />

      case 'settings':
        return <EmployerSettings />

      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar 
        userType={UserType.EMPLOYER}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           
            {renderContent()}
          </div>
        </main>
      </div>

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        job={editingJob}
        onSuccess={handleEditSuccess}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
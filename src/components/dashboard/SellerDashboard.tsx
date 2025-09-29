"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from './DashboardSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useSellerHouses, useDeleteHouse, useSellerInquiries } from '@/hooks/useApi'
import { House, UserType } from '@/lib/api/config'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

import { SellerOverview } from './SellerOverview'
import { SellerProperties } from './SellerProperties'
import { SellerNotifications } from './SellerNotifications'
import { SellerSettings } from './SellerSettings'
import { PaymentPage } from '@/components/payments/PaymentPage'
import { EditHouseModal } from '../listings/EditHouseModal'
import { SubscriptionManagement } from './SubscriptionManagement'
import { SellerInquiries } from './SellerInquiries'

export function SellerDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [editingHouse, setEditingHouse] = useState<House | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    houseId: string | null
    houseTitle: string | null
  }>({
    isOpen: false,
    houseId: null,
    houseTitle: null
  })
  
  const { houses: myHouses, loading, error, refetch } = useSellerHouses(user?.id)
  const { deleteHouse, loading: deleteLoading } = useDeleteHouse()
  const { inquiries } = useSellerInquiries()
  
  const totalHouses = myHouses.length
  const activeHouses = myHouses.filter(house => house.status === 'active').length
  const totalInquiries = 0
  const pendingInquiries = 0
  const recentHouses = myHouses.filter(house => new Date(house.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).slice(0, 3)


  const handleEditHouse = (house: House) => {
    setEditingHouse(house)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    refetch()
  }

  const handleDeleteHouse = (houseId: string, houseTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      houseId,
      houseTitle
    })
  }

  const confirmDeleteHouse = async () => {
    if (!deleteConfirmation.houseId) return
    
    try {
      await deleteHouse(deleteConfirmation.houseId)
      refetch()
      setDeleteConfirmation({
        isOpen: false,
        houseId: null,
        houseTitle: null
      })
    } catch (error) {
      console.error('Failed to delete house:', error)
    }
  }

  const cancelDeleteHouse = () => {
    setDeleteConfirmation({
      isOpen: false,
      houseId: null,
      houseTitle: null
    })
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingHouse(null)
  }

  const handleCreateHouse = () => {
    router.push('/houses/create')
  }

  
  
  const handleUpdateInquiry = async (inquiryId: string, status: string) => {
    console.log('Updating inquiry:', inquiryId, status)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <SellerOverview
            user={user}
            totalHouses={totalHouses}
            activeHouses={activeHouses}
            totalInquiries={totalInquiries || 0}
            pendingInquiries={pendingInquiries}
            recentHouses={recentHouses}
            loading={loading}
            error={error}
            onEditHouse={handleEditHouse}
            onCreateHouse={handleCreateHouse}
          />
        )

      case 'properties':
        return (
          <SellerProperties
            myHouses={myHouses}
            loading={loading}
            onEditHouse={handleEditHouse}
            onDeleteHouse={handleDeleteHouse}
            onCreateHouse={handleCreateHouse}
            onRefresh={refetch}
          />
        )

      case 'inquiries':
        return <SellerInquiries inquiries={inquiries} loading={loading} onUpdateInquiry={handleUpdateInquiry} />

      case 'payments':
        return <PaymentPage />

      case 'subscription':
        return <SubscriptionManagement />

      case 'notifications':
        return <SellerNotifications />

      case 'settings':
        return <SellerSettings />

      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        userType={UserType.SELLER}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>

      <EditHouseModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        house={editingHouse}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={cancelDeleteHouse}
        onConfirm={confirmDeleteHouse}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteConfirmation.houseTitle}"? This action cannot be undone and will permanently remove the property listing.`}
        confirmText="Delete Property"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { SubscriptionTable } from '@/components/admin/SubscriptionTable'
import { SubscriptionDetailsModal } from '@/components/admin/SubscriptionDetailsModal'
import { CreateEditSubscriptionModal } from '@/components/admin/CreateEditSubscriptionModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Subscription } from '@/lib/api/config'
import { SubscriptionService } from '@/lib/api/subscription-service'
import { CommissionService } from '@/lib/api/commission-service'
import { AdminService, AdminUser } from '@/lib/api/admin-services'
import { toast } from 'sonner'
import { RefreshCw, XCircle, CheckCircle, Clock, X, Plus } from 'lucide-react'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [commissions, setCommissions] = useState<any[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  
  const subscriptionService = new SubscriptionService()
  const commissionService = new CommissionService()
  const adminService = new AdminService()

  // Fetch subscriptions, commissions, and users
  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch subscriptions, commissions, and users in parallel
      const [subscriptionsData, commissionsData, usersData] = await Promise.all([
        subscriptionService.getSubscriptions(),
        commissionService.getCommissions(),
        adminService.getAllUsers({ limit: 1000 })
      ])
      
      setCommissions(commissionsData)
      setUsers(usersData.users)
      
      // Merge commission and user data with subscriptions
      const enrichedSubscriptions = subscriptionsData.map(subscription => {
        const commission = commissionsData.find(comm => comm.id === subscription.commission_id)
        const user = usersData.users.find(u => u.id === subscription.subscriber_id)
        
        return {
          ...subscription,
          commission: commission || {
            id: subscription.commission_id,
            title: 'Unknown Commission',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            payment_type: 'MONTHLY' as any, // Fallback type
            amount: 0,
            createdAt: '',
            updatedAt: ''
          },
          subscriber: user ? {
            id: user.id,
            full_name: user.full_name,
            email: user.email
          } : subscription.subscriber || {
            id: subscription.subscriber_id,
            full_name: 'Unknown User',
            email: 'unknown@example.com'
          }
        }
      })
      
      setSubscriptions(enrichedSubscriptions)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscriptions'
      setError(errorMessage)
      toast.error('Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      'ACTIVE': 'default',
      'INACTIVE': 'secondary',
      'EXPIRED': 'destructive',
    } as const

    const icons = {
      'ACTIVE': CheckCircle,
      'INACTIVE': Clock,
      'EXPIRED': X,
    } as const

    const Icon = icons[status as keyof typeof icons] || Clock

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  // Handle subscription actions
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription)
  }

  // Handle subscription deletion
  const handleDeleteSubscription = async (subscription: Subscription) => {
    if (window.confirm(`Are you sure you want to delete this subscription for ${subscription.subscriber.full_name}?`)) {
      try {
        await subscriptionService.deleteSubscription(subscription.id)
        toast.success('Subscription deleted successfully')
        fetchSubscriptions()
      } catch (error) {
        console.error('Error deleting subscription:', error)
        toast.error('Failed to delete subscription')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
            <p className="text-gray-600">Manage user subscriptions and commission plans</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSubscriptions} className="cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>

        {error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <XCircle className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Error Loading Subscriptions</h3>
                <p className="text-gray-600 mt-2">{error}</p>
              </div>
              <Button onClick={fetchSubscriptions} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading subscriptions...</p>
            </div>
          </div>
        ) : (
          <SubscriptionTable
            subscriptions={subscriptions}
            loading={loading}
            onViewDetails={handleViewDetails}
            onEditSubscription={handleEditSubscription}
            onDeleteSubscription={handleDeleteSubscription}
          />
        )}

        {(showCreateModal || editingSubscription) && (
          <CreateEditSubscriptionModal
            subscription={editingSubscription}
            commissions={commissions}
            users={users}
            onClose={() => {
              setShowCreateModal(false)
              setEditingSubscription(null)
            }}
            onSuccess={() => {
              setShowCreateModal(false)
              setEditingSubscription(null)
              fetchSubscriptions()
            }}
          />
        )}

        {/* Subscription Details Modal */}
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </AdminLayout>
  )
}

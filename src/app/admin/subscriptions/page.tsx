"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataDisplay, DataDisplayColumn, DataDisplayAction } from '@/components/ui/data-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Subscription, CommissionType } from '@/lib/api/config'
import { SubscriptionService } from '@/lib/api/subscription-service'
import { CommissionService } from '@/lib/api/commission-service'
import { AdminService, AdminUser } from '@/lib/api/admin-services'
import { toast } from 'sonner'
import { Eye, Trash2, User, Calendar, DollarSign, RefreshCw, XCircle, CheckCircle, Clock, X, Plus, Edit } from 'lucide-react'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  
  const subscriptionService = new SubscriptionService()

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await subscriptionService.getSubscriptions()
      setSubscriptions(data)
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

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
    {
      key: 'subscriber.full_name',
      label: 'Subscriber',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'commission.title',
      label: 'Commission Plan',
      render: (value) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">
            {value === CommissionType.SUBSCRIPTION 
              ? `${value} subscription`
              : `Per ${value} post`
            }
          </div>
        </div>
      )
    },
    {
      key: 'commission.amount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium">ETB {parseFloat(value?.toString() || '0').toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'EXPIRED', label: 'Expired' },
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'start_date',
      label: 'Start Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'end_date',
      label: 'End Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  // Define actions for DataDisplay
  const getActionsForSubscription = (subscription: Subscription): DataDisplayAction[] => {
    return [
      {
        key: 'view',
        label: 'View Details',
        icon: <Eye className="h-4 w-4" />,
        onClick: () => setSelectedSubscription(subscription),
        className: 'text-blue-600'
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        onClick: () => setEditingSubscription(subscription),
        className: 'text-green-600'
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => handleDeleteSubscription(subscription),
        className: 'text-red-600'
      }
    ]
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
          <DataDisplay
            data={subscriptions || []}
            columns={columns}
            actions={getActionsForSubscription}
            loading={loading}
            title="All Subscriptions"
            description="Manage user subscriptions and their commission plans"
            defaultView="table"
            emptyMessage="No subscriptions found. Users will appear here when they subscribe to commission plans."
            searchPlaceholder="Search subscriptions by subscriber name or email..."
            searchFields={['subscriber.full_name', 'subscriber.email', 'commission.title']}   
            totalItems={subscriptions?.length || 0}
            showFilters={true}
            itemsPerPage={10}
            onItemClick={() => {
            }}
          />
        )}

        {/* Create/Edit Subscription Modal */}
        {(showCreateModal || editingSubscription) && (
          <CreateEditSubscriptionModal
            subscription={editingSubscription}
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
        {selectedSubscription && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Subscription Details</CardTitle>
                    <CardDescription>
                      Subscription ID: {selectedSubscription.id.split('-')[1].toUpperCase() + '...'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSubscription(null)}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subscriber Information */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Subscriber Information</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="font-medium">{selectedSubscription.subscriber.full_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{selectedSubscription.subscriber.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Subscriber ID:</span>
                      <p className="font-medium">{selectedSubscription.subscriber_id.split('-')[1].toUpperCase() + '...'}</p>
                    </div>
                  </div>
                </div>

                {/* Commission Plan */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-900">Commission Plan</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Plan Title:</span>
                      <p className="font-medium">{selectedSubscription.commission.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment Type:</span>
                      <p className="font-medium">{selectedSubscription.commission.payment_type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Amount:</span>
                      <p className="font-medium">ETB {parseFloat(selectedSubscription.commission.amount?.toString() || '0').toLocaleString()}</p>
                    </div>
                    {selectedSubscription.commission.subscription && (
                      <div>
                        <span className="text-sm text-gray-600">Subscription Period:</span>
                        <p className="font-medium">{selectedSubscription.commission.subscription}</p>
                      </div>
                    )}
                    {selectedSubscription.commission.per_post && (
                      <div>
                        <span className="text-sm text-gray-600">Post Type:</span>
                        <p className="font-medium">{selectedSubscription.commission.per_post}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscription Status */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-gray-900">Subscription Details</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedSubscription.status)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <p className="font-medium">
                        {new Date(selectedSubscription.start_date).toLocaleDateString()} at{' '}
                        {new Date(selectedSubscription.start_date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">End Date:</span>
                      <p className="font-medium">
                        {new Date(selectedSubscription.end_date).toLocaleDateString()} at{' '}
                        {new Date(selectedSubscription.end_date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Created:</span>
                      <p className="font-medium">
                        {new Date(selectedSubscription.createdAt).toLocaleDateString()} at{' '}
                        {new Date(selectedSubscription.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// Create/Edit Subscription Modal Component
interface CreateEditSubscriptionModalProps {
  subscription?: Subscription | null
  onClose: () => void
  onSuccess: () => void
}

function CreateEditSubscriptionModal({ subscription, onClose, onSuccess }: CreateEditSubscriptionModalProps) {
  const [formData, setFormData] = useState({
    commission_id: '',
    subscriber_id: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'EXPIRED',
    start_date: '',
    end_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [commissions, setCommissions] = useState<any[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])

  const subscriptionService = new SubscriptionService()
  const commissionService = new CommissionService()
  const adminService = new AdminService()

  useEffect(() => {
    if (subscription) {
      setFormData({
        commission_id: subscription.commission_id,
        subscriber_id: subscription.subscriber_id,
        status: subscription.status as 'ACTIVE' | 'INACTIVE' | 'EXPIRED',
        start_date: new Date(subscription.start_date).toISOString().split('T')[0],
        end_date: new Date(subscription.end_date).toISOString().split('T')[0]
      })
    } else {
      // Set default dates for new subscription
      const today = new Date()
      const nextMonth = new Date(today)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      
      setFormData({
        commission_id: '',
        subscriber_id: '',
        status: 'ACTIVE',
        start_date: today.toISOString().split('T')[0],
        end_date: nextMonth.toISOString().split('T')[0]
      })
    }
  }, [subscription])

  useEffect(() => {
    // Fetch commissions and users for dropdowns
    const fetchData = async () => {
      try {
        const [commissionsData, usersData] = await Promise.all([
          commissionService.getCommissions(),
          adminService.getAllUsers({ limit: 1000 })
        ])
        setCommissions(commissionsData)
        setUsers(usersData.users)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const subscriptionData = {
        commission_id: formData.commission_id,
        subscriber_id: formData.subscriber_id,
        status: formData.status,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      }

      if (subscription) {
        await subscriptionService.updateSubscription(subscription.id, subscriptionData)
        toast.success('Subscription updated successfully')
      } else {
        await subscriptionService.createSubscription(subscriptionData)
        toast.success('Subscription created successfully')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error saving subscription:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save subscription'
      setError(errorMessage)
      toast.error('Failed to save subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{subscription ? 'Edit Subscription' : 'Create Subscription'}</CardTitle>
              <CardDescription>
                {subscription ? 'Update subscription details' : 'Create a new subscription for a user'}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Commission Plan *</label>
              <select
                value={formData.commission_id}
                onChange={(e) => setFormData({ ...formData, commission_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select commission plan"
                required
              >
                <option value="">Select a commission plan</option>
                {commissions.map((commission) => (
                  <option key={commission.id} value={commission.id}>
                    {commission.title} - ETB {commission.amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subscriber *</label>
              <select
                value={formData.subscriber_id}
                onChange={(e) => setFormData({ ...formData, subscriber_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select subscriber"
                required
              >
                <option value="">Select a subscriber</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name} ({user.user_type})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'EXPIRED' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select subscription status"
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select start date"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date *</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select end date"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (subscription ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
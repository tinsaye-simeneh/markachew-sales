"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataDisplay, DataDisplayColumn, DataDisplayAction } from '@/components/ui/data-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Commission, CommissionType, SubscriptionPeriod, PostType } from '@/lib/api/config'
import { CommissionService } from '@/lib/api/commission-service'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, DollarSign, Calendar, Tag, RefreshCw, XCircle, X } from 'lucide-react'

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null)
  
  const commissionService = new CommissionService()

  // Fetch commissions
  const fetchCommissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await commissionService.getCommissions()
      setCommissions(data)
    } catch (error) {
      console.error('Error fetching commissions:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch commissions'
      setError(errorMessage)
      toast.error('Failed to fetch commissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommissions()
  }, [])

  // Get commission type badge
  const getTypeBadge = (type: CommissionType) => {
    const variants = {
      [CommissionType.SUBSCRIPTION]: 'default',
      [CommissionType.PER_POST]: 'secondary',
    } as const

    return (
      <Badge variant={variants[type]} className="flex items-center gap-1">
        <Tag className="h-3 w-3" />
        {type.replace('_', ' ')}
      </Badge>
    )
  }

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'payment_type',
      label: 'Type',
      filterable: true,
      filterOptions: [
        { value: CommissionType.SUBSCRIPTION, label: 'Subscription' },
        { value: CommissionType.PER_POST, label: 'Per Post' },
      ],
      render: (value) => getTypeBadge(value as CommissionType)
    },
    {
      key: 'subscription',
      label: 'Period',
      render: (value, item) => {
        if (item.payment_type === CommissionType.SUBSCRIPTION && value) {
          return (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {value}
            </Badge>
          )
        }
        return <span className="text-gray-400">-</span>
      }
    },
    {
      key: 'per_post',
      label: 'Post Type',
      render: (value, item) => {
        if (item.payment_type === CommissionType.PER_POST && value) {
          return (
            <Badge variant="outline">
              {value}
            </Badge>
          )
        }
        return <span className="text-gray-400">-</span>
      }
    },
    {
      key: 'amount',
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
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ]

  // Define actions for DataDisplay
  const getActionsForCommission = (commission: Commission): DataDisplayAction[] => {
    return [
      {
        key: 'edit',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        onClick: () => setEditingCommission(commission),
        className: 'text-blue-600'
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => handleDeleteCommission(commission),
        className: 'text-red-600'
      }
    ]
  }

  // Handle commission deletion
  const handleDeleteCommission = async (commission: Commission) => {
    if (window.confirm(`Are you sure you want to delete "${commission.title}"?`)) {
      try {
        await commissionService.deleteCommission(commission.id)
        toast.success('Commission deleted successfully')
        fetchCommissions()
      } catch (error) {
        console.error('Error deleting commission:', error)
        toast.error('Failed to delete commission')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Commission Management</h1>
            </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchCommissions} className="cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Commission
            </Button>
          </div>
        </div>

        {error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <XCircle className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Error Loading Commissions</h3>
                <p className="text-gray-600 mt-2">{error}</p>
              </div>
              <Button onClick={fetchCommissions} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading commissions...</p>
            </div>
          </div>
        ) : (
          <DataDisplay
            data={commissions || []}
            columns={columns}
            actions={getActionsForCommission}
            loading={loading}
            title="All Commissions"
            description="Manage commission types for different payment models"
            defaultView="table"
            emptyMessage="No commissions found. Create your first commission type."
            searchPlaceholder="Search commissions by title or type..."
            searchFields={['title', 'payment_type']}   
            totalItems={commissions?.length || 0}
            showFilters={true}
            itemsPerPage={10}
            onItemClick={(commission: Commission) => {
              setEditingCommission(commission)
            }}
          />
        )}

        {/* Create/Edit Commission Modal */}
        {(showCreateModal || editingCommission) && (
          <CreateEditCommissionModal
            commission={editingCommission}
            onClose={() => {
              setShowCreateModal(false)
              setEditingCommission(null)
            }}
            onSuccess={() => {
              setShowCreateModal(false)
              setEditingCommission(null)
              fetchCommissions()
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

// Commission Modal Component
interface CreateEditCommissionModalProps {
  commission?: Commission | null
  onClose: () => void
  onSuccess: () => void
}

function CreateEditCommissionModal({ commission, onClose, onSuccess }: CreateEditCommissionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    payment_type: CommissionType.PER_POST,
    subscription: SubscriptionPeriod.MONTH,
    per_post: PostType.HOUSE,
    amount: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const commissionService = new CommissionService()

  useEffect(() => {
    if (commission) {
      setFormData({
        title: commission.title,
        payment_type: commission.payment_type,
        subscription: commission.subscription || SubscriptionPeriod.MONTH,
        per_post: commission.per_post || PostType.HOUSE,
        amount: commission.amount
      })
    }
  }, [commission])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const commissionData = {
        title: formData.title,
        payment_type: formData.payment_type,
        amount: formData.amount,
        ...(formData.payment_type === CommissionType.SUBSCRIPTION && {
          subscription: formData.subscription
        }),
        ...(formData.payment_type === CommissionType.PER_POST && {
          per_post: formData.per_post
        })
      }

      if (commission) {
        await commissionService.updateCommission(commission.id, commissionData)
        toast.success('Commission updated successfully')
      } else {
        await commissionService.createCommission()
        toast.success('Commission created successfully')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error saving commission:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save commission'
      setError(errorMessage)
      toast.error('Failed to save commission')
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
              <CardTitle>{commission ? 'Edit Commission' : 'Create Commission'}</CardTitle>
              <CardDescription>
                {commission ? 'Update commission details' : 'Create a new commission type'}
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
              <label className="text-sm font-medium">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Monthly Subscription, Per House Post"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Type *</label>
              <select
                value={formData.payment_type}
                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as CommissionType })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select payment type"
                required
              >
                <option value={CommissionType.PER_POST}>Per Post</option>
                <option value={CommissionType.SUBSCRIPTION}>Subscription</option>
              </select>
            </div>

            {formData.payment_type === CommissionType.SUBSCRIPTION && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Subscription Period *</label>
                <select
                  value={formData.subscription}
                  onChange={(e) => setFormData({ ...formData, subscription: e.target.value as SubscriptionPeriod })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select subscription period"
                  required
                >
                  <option value={SubscriptionPeriod.MONTH}>Monthly</option>
                  <option value={SubscriptionPeriod.YEAR}>Yearly</option>
                </select>
              </div>
            )}

            {formData.payment_type === CommissionType.PER_POST && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Type *</label>
                <select
                  value={formData.per_post}
                  onChange={(e) => setFormData({ ...formData, per_post: e.target.value as PostType })}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Select post type"
                  required
                >
                  <option value={PostType.HOUSE}>House</option>
                  <option value={PostType.JOB}>Job</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (ETB) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (commission ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
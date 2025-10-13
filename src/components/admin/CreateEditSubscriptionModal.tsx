"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Subscription } from '@/lib/api/config'
import { AdminUser } from '@/lib/api/admin-services'
import { SubscriptionService } from '@/lib/api/subscription-service'
import { toast } from 'sonner'
import { X } from 'lucide-react'

interface CreateEditSubscriptionModalProps {
  subscription?: Subscription | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commissions?: any[]
  users?: AdminUser[]
  onClose: () => void
  onSuccess: () => void
}

export function CreateEditSubscriptionModal({ 
  subscription, 
  commissions = [], 
  users = [], 
  onClose, 
  onSuccess 
}: CreateEditSubscriptionModalProps) {
  const [formData, setFormData] = useState({
    commission_id: '',
    subscriber_id: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'EXPIRED',
    start_date: '',
    end_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscriptionService = new SubscriptionService()

  const getCommissionPeriodInfo = () => {
    if (!formData.commission_id) return null
    const selectedCommission = commissions.find(comm => comm.id === formData.commission_id)
    if (!selectedCommission) return null
    
    if (selectedCommission.subscription) {
      return `Duration: ${selectedCommission.subscription}`
    }
    return 'Duration: 1 Month (default)'
  }

  useEffect(() => {
    if (subscription) {
      setFormData({
        commission_id: subscription.commission_id,
        subscriber_id: subscription.subscriber_id,
        status: subscription.status as 'ACTIVE' | 'INACTIVE' | 'EXPIRED',
        start_date: new Date(subscription.createdAt).toISOString().split('T')[0],
        end_date: new Date(subscription.end_date).toISOString().split('T')[0]
      })
    } else {
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
    if (formData.commission_id) {
      const selectedCommission = commissions.find(comm => comm.id === formData.commission_id)
      if (selectedCommission) {
        const today = new Date()
        const endDate = new Date(today)
        
        if (selectedCommission.subscription) {
          const period = selectedCommission.subscription.toLowerCase()
          if (period.includes('month') || period.includes('monthly')) {
            endDate.setMonth(endDate.getMonth() + 1)
          } else if (period.includes('year') || period.includes('yearly') || period.includes('annual')) {
            endDate.setFullYear(endDate.getFullYear() + 1)
          } else if (period.includes('week') || period.includes('weekly')) {
            endDate.setDate(endDate.getDate() + 7)
          } else if (period.includes('day') || period.includes('daily')) {
            endDate.setDate(endDate.getDate() + 1)
          } else {
            endDate.setMonth(endDate.getMonth() + 1)
          }
        } else {
          endDate.setMonth(endDate.getMonth() + 1)
        }
        
        setFormData(prev => ({
          ...prev,
          start_date: today.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }))
      }
    }
  }, [formData.commission_id, commissions])

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
              {formData.commission_id && getCommissionPeriodInfo() && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
                  {getCommissionPeriodInfo()}
                </div>
              )}
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
                <label className="text-sm font-medium">
                  Start Date *
                  {formData.commission_id && (
                    <span className="text-xs text-gray-500 ml-1">(Auto-set from commission plan)</span>
                  )}
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formData.commission_id ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  title={formData.commission_id ? "Start date is automatically set based on commission plan" : "Select start date"}
                  required
                  disabled={!!formData.commission_id}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Date *
                  {formData.commission_id && (
                    <span className="text-xs text-gray-500 ml-1">(Auto-set from commission plan)</span>
                  )}
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formData.commission_id ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  title={formData.commission_id ? "End date is automatically calculated based on commission plan duration" : "Select end date"}
                  required
                  disabled={!!formData.commission_id}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className='cursor-pointer'>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className='cursor-pointer'>
                {loading ? 'Saving...' : (subscription ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
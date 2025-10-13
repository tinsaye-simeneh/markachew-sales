"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SubscriptionService } from '@/lib/api/subscription-service'
import { CommissionService } from '@/lib/api/commission-service'
import { Subscription, Commission, CommissionType } from '@/lib/api/config'
import { toast } from 'sonner'
import { Calendar, DollarSign, CheckCircle, Clock, X, Plus, RefreshCw, XCircle } from 'lucide-react'

export function SubscriptionManagement() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)

  const subscriptionService = new SubscriptionService()
  const commissionService = new CommissionService()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [subscriptionsData, commissionsData] = await Promise.all([
        subscriptionService.getSubscriptions(),
        commissionService.getCommissions()
      ])
      
      const userSubscription = subscriptionsData.find(sub => sub.subscriber_id === user?.id)
      setSubscription(userSubscription || null)
      setCommissions(commissionsData)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscription data'
      setError(errorMessage)
      toast.error('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

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

  const handleSubscribe = async (commissionId: string) => {
    try {
      const subscriptionData = {
        commission_id: commissionId,
        subscriber_id: user?.id || '',
        status: 'ACTIVE' as const,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }

      await subscriptionService.createSubscription(subscriptionData)
      toast.success('Subscription created successfully!')
      setShowSubscribeModal(false)
      fetchData()
    } catch (error) {
      console.error('Error creating subscription:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create subscription'
      
      if (errorMessage.includes('User profile not found') || errorMessage.includes('Profile not found')) {
        toast.error('Please check your payment approval status')
      } else {
        toast.error(errorMessage)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Subscription</h3>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage your subscription plan and billing</p>
        </div>
        <Button variant="outline" onClick={fetchData} className="cursor-pointer">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {subscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Your active subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
             
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                {getStatusBadge(subscription.end_date > new Date().toISOString() ? 'ACTIVE' : 'INACTIVE')}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start Date:</span>
                <span className="font-medium">
                  {new Date(subscription.createdAt || '').toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">End Date:</span>
                <span className="font-medium">
                  {new Date(subscription.end_date || '').toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Actions</CardTitle>
              <CardDescription>
                Manage your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
             
              <Button 
                variant="outline" 
                className="w-full cursor-pointer"
                onClick={() => setShowSubscribeModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Change Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                No Active Subscription
              </CardTitle>
              <CardDescription>
                You don&apos;t have an active subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started with a Plan</h3>
                <p className="text-gray-600 mb-4">
                  Choose a subscription plan to unlock premium features and unlimited postings.
                </p>
                <Button 
                  onClick={() => setShowSubscribeModal(true)}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Subscribe Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose the plan that fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissions.map((commission) => (
                  <div key={commission.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{commission.title}</h4>
                        <p className="text-sm text-gray-600">
                          {commission.payment_type === CommissionType.SUBSCRIPTION 
                            ? `${commission.subscription} subscription`
                            : `Per ${commission.per_post} post`
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          ETB {parseFloat(commission.amount?.toString() || '0').toLocaleString()}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSubscribe(commission.id)}
                          className="mt-2 cursor-pointer"
                        >
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Choose a Plan</CardTitle>
                  <CardDescription>
                    Select a subscription plan that fits your needs
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubscribeModal(false)}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">{commission.title}</h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ETB {parseFloat(commission.amount?.toString() || '0').toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {commission.payment_type === CommissionType.SUBSCRIPTION 
                          ? `${commission.subscription} subscription`
                          : `Per ${commission.per_post} post`
                        }
                      </p>
                      <Button 
                        onClick={() => handleSubscribe(commission.id)}
                        className="w-full cursor-pointer"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
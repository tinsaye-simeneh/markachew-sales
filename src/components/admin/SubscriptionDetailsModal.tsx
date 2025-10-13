"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Subscription } from '@/lib/api/config'
import { User, DollarSign, Calendar, X } from 'lucide-react'
  
interface SubscriptionDetailsModalProps {
  subscription: Subscription | null
  onClose: () => void
  getStatusBadge: (status: string) => React.ReactElement
}

export function SubscriptionDetailsModal({ 
  subscription,
  onClose, 
  getStatusBadge 
}: SubscriptionDetailsModalProps) {
  if (!subscription) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Subscription ID: {subscription.id.split('-')[1].toUpperCase() + '...'}
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
                <p className="font-medium">{subscription.subscriber.full_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{subscription.subscriber.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Subscriber ID:</span>
                <p className="font-medium">{subscription.subscriber_id.split('-')[1].toUpperCase() + '...'}</p>
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
                <p className="font-medium">{subscription.commission.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Payment Type:</span>
                <p className="font-medium">{subscription.commission.payment_type.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Amount:</span>
                <p className="font-medium">ETB {subscription.commission.amount.toLocaleString()}</p>
              </div>
              {subscription.commission.subscription && (
                <div>
                  <span className="text-sm text-gray-600">Subscription Period:</span>
                  <p className="font-medium">{subscription.commission.subscription}</p>
                </div>
              )}
              {subscription.commission.per_post && (
                <div>
                  <span className="text-sm text-gray-600">Post Type:</span>
                  <p className="font-medium">{subscription.commission.per_post}</p>
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
                <div className="mt-1">{getStatusBadge(subscription.status)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Start Date:</span>
                <p className="font-medium">
                  {new Date(subscription.start_date).toLocaleDateString()} at{' '}
                  {new Date(subscription.start_date).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">End Date:</span>
                <p className="font-medium">
                  {new Date(subscription.end_date).toLocaleDateString()} at{' '}
                  {new Date(subscription.end_date).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Created:</span>
                <p className="font-medium">
                  {new Date(subscription.createdAt).toLocaleDateString()} at{' '}
                  {new Date(subscription.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
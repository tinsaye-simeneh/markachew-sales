"use client"

import { DataDisplay, DataDisplayColumn, DataDisplayAction } from '@/components/ui/data-display'
import { Subscription } from '@/lib/api/config'
import { User, Calendar, DollarSign, Eye, Trash2, Edit } from 'lucide-react'

interface SubscriptionTableProps {
  subscriptions: Subscription[]
  loading: boolean
  onViewDetails: (subscription: Subscription) => void
  onEditSubscription: (subscription: Subscription) => void
  onDeleteSubscription: (subscription: Subscription) => void
}

export function SubscriptionTable({
  subscriptions,
  loading,
  onViewDetails,
  onEditSubscription,
  onDeleteSubscription,
}: SubscriptionTableProps) {
  const columns: DataDisplayColumn[] = [
    {
      key: 'subscriber_id',
      label: 'Subscriber',
      sortable: true,
      render: (value, subscription: Subscription) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <div className="font-medium text-gray-900">{subscription.subscriber?.full_name || 'Unknown User'}</div>
            <div className="text-xs text-gray-500">{subscription.subscriber?.email || subscription.subscriber_id.split('-')[1].toUpperCase() + '...'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'commission',
      label: 'Commission Plan',
      sortable: true,
      render: (value, subscription: Subscription) => (
        <div>
          <div className="font-medium text-gray-900">{subscription.commission?.title || 'Unknown Commission'}</div>
          <div className="text-xs text-gray-500">
            {subscription.commission?.payment_type ? subscription.commission.payment_type.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
            {subscription.commission?.subscription && ` • ${subscription.commission.subscription}`}
            {subscription.commission?.per_post && ` • ${subscription.commission.per_post}`}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value, subscription: Subscription) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium">ETB {(subscription.commission?.amount || 0).toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value, subscription: Subscription) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{new Date(subscription.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'end_date',
      label: 'End Date',
      sortable: true,
      render: (value, subscription: Subscription) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{new Date(subscription.end_date).toLocaleDateString()}</span>
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
        onClick: () => onViewDetails(subscription),
        className: 'text-blue-600'
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        onClick: () => onEditSubscription(subscription),
        className: 'text-green-600'
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => onDeleteSubscription(subscription),
        className: 'text-red-600'
      }
    ]
  }

  return (
    <DataDisplay
      data={subscriptions || []}
      columns={columns}
      actions={getActionsForSubscription}
      loading={loading}
      title="All Subscriptions"
      description="Manage user subscriptions and their commission plans"
      defaultView="table"
      emptyMessage="No subscriptions found. Users will appear here when they subscribe to commission plans."
      searchPlaceholder="Search by subscriber name, email, or commission plan..."
      searchFields={['subscriber.full_name', 'subscriber.email', 'commission.title', 'commission.payment_type']}   
      totalItems={subscriptions?.length || 0}
      showFilters={true}
      itemsPerPage={10}
      onItemClick={() => {}}
    />
  )
}
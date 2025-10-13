"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DataDisplay, DataDisplayColumn, DataDisplayAction } from '@/components/ui/data-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Payment, PaymentStatus, normalizePaymentStatus } from '@/lib/api/config'
import { PaymentService } from '@/lib/api/payment-service'
import { toast } from 'sonner'
import { Eye, CheckCircle, XCircle, Clock, DollarSign, User, Calendar, RefreshCw, X } from 'lucide-react'
import Image from 'next/image'  

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    imageUrl: string
    amount: string
  }>({
    isOpen: false,
    imageUrl: '',
    amount: ''
  })
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean
    payment: Payment | null
  }>({
    isOpen: false,
    payment: null
  })
  const paymentService = new PaymentService()
  
  // Base URL for images
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://employee.luckbingogames.com'

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await paymentService.getPayments()
      
       const paymentsData = response?.payments || []
      const totalItems = response?.meta?.totalItems || paymentsData.length
      
      if (!Array.isArray(paymentsData)) {
        console.error('Payments data is not an array:', paymentsData)
        setError('Invalid payment data received from server')
        toast.error('Invalid payment data received')
        return
      }
      
      setPayments(paymentsData)
      setTotal(totalItems)
    } catch (error) {
      console.error('Error fetching payments:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments'
      setError(errorMessage)
      toast.error('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Get status badge
  const getStatusBadge = (status: PaymentStatus | string) => {
    const normalizedStatus = normalizePaymentStatus(status.toString())
    
    const variants = {
      [PaymentStatus.PENDING]: 'secondary',
      [PaymentStatus.APPROVED]: 'default',
      [PaymentStatus.REJECTED]: 'destructive',
      [PaymentStatus.COMPLETED]: 'default'
    } as const

    const icons = {
      [PaymentStatus.PENDING]: Clock,
      [PaymentStatus.APPROVED]: CheckCircle,
      [PaymentStatus.REJECTED]: XCircle,
      [PaymentStatus.COMPLETED]: CheckCircle
    } as const

    const Icon = icons[normalizedStatus]

    return (
      <Badge variant={variants[normalizedStatus]} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {normalizedStatus}
      </Badge>
    )
  }

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
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
      key: 'payer.full_name',
      label: 'Payer',
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">{value || 'No Payer'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: PaymentStatus.PENDING, label: 'Pending' },
        { value: PaymentStatus.APPROVED, label: 'Approved' },
        { value: PaymentStatus.REJECTED, label: 'Rejected' },
        { value: PaymentStatus.COMPLETED, label: 'Completed' },
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'receipt_image',
      label: 'Receipt',
      render: (value) => (
        value ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openImageModal(value, payments.find(payment => payment.receipt_image === value)?.amount.toString() || '0')}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Image src={`${BASE_URL}/${value}`} className="h-3 w-3" alt="View" width={16} height={16} />
            View
          </Button>
        ) : (
          <span className="text-gray-400 text-sm">No receipt</span>
        )
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  // Define actions for DataDisplay
  const getActionsForPayment = (payment: Payment): DataDisplayAction[] => {
    const actions: DataDisplayAction[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: <Eye className="h-4 w-4" />,
        onClick: () => openDetailModal(payment),
        className: 'text-blue-600'
      }
    ]

    // Add status-specific actions
    const normalizedStatus = normalizePaymentStatus(payment.status.toString())
    if (normalizedStatus === PaymentStatus.PENDING) {
      actions.push(
        {
          key: 'approve',
          label: 'Approve',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => handleStatusUpdate(payment, PaymentStatus.APPROVED),
          className: 'text-green-600'
        },
        {
          key: 'reject',
          label: 'Reject',
          icon: <XCircle className="h-4 w-4" />,
          onClick: () => handleStatusUpdate(payment, PaymentStatus.REJECTED),
          className: 'text-red-600'
        }
      )
    }

    return actions
  }

  const handleStatusUpdate = async (payment: Payment, newStatus: PaymentStatus) => {
    try {
      const statusMap: Record<PaymentStatus, 'Approved' | 'Rejected' | 'Pending'> = {
        [PaymentStatus.APPROVED]: 'Approved',
        [PaymentStatus.REJECTED]: 'Rejected',
        [PaymentStatus.PENDING]: 'Pending',
        [PaymentStatus.COMPLETED]: 'Approved' 
      }
      
      const apiStatus = statusMap[newStatus]
      await paymentService.updatePaymentStatus(payment.id, apiStatus)
      toast.success(`Payment ${newStatus.toLowerCase()} successfully`)
      fetchPayments() // Refresh the list
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  const openImageModal = (imagePath: string, amount: string) => {
    const fullImageUrl = `${BASE_URL}/${imagePath}`
    setImageModal({
      isOpen: true,
      imageUrl: fullImageUrl,
      amount: amount
    })
  }

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      amount: ''
    })
  }

  // Handle detail modal
  const openDetailModal = (payment: Payment) => {
    setDetailModal({
      isOpen: true,
      payment: payment
    })
  }


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
            </div>
          <Button variant="outline" onClick={fetchPayments} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <XCircle className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Error Loading Payments</h3>
                <p className="text-gray-600 mt-2">{error}</p>
              </div>
              <Button onClick={fetchPayments} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payments...</p>
            </div>
          </div>
        ) : (
          <DataDisplay
            data={payments || []}
            columns={columns}
            actions={getActionsForPayment}
            loading={loading}
            title="All Payments"
            description="A list of all payment submissions in the system"
            defaultView="table"
            emptyMessage="No payments found. Payment submissions will appear here."
            searchPlaceholder="Search payments by payer name, email, or amount..."
            searchFields={['payer.full_name', 'payer.email', 'amount']}   
            totalItems={total || 0}
            showFilters={true}
            itemsPerPage={5}
            onItemClick={() => {
            }}
          />
        )}

        {imageModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Payment Receipt</CardTitle>
                    <CardDescription>Amount: ETB {imageModal.amount}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeImageModal}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={imageModal.imageUrl}
                    alt="Payment Receipt"
                    className="w-full h-auto max-h-[70vh] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-image.png' 
                      target.alt = 'Image not found'
                    }}
                    width={1000}
                    height={1000}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detail Modal */}
        {detailModal.isOpen && detailModal.payment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Amount: ETB {detailModal.payment.amount}</CardDescription>
                    </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailModal({ isOpen: false, payment: null })}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Payment Status</h3>
                      <p className="text-sm text-gray-600">Current payment status</p>
                    </div>
                  </div>
                  {getStatusBadge(detailModal.payment.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-900">Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ETB {parseFloat(detailModal.payment.amount?.toString() || '0').toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Created Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(detailModal.payment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(detailModal.payment.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Payer Information</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Payer ID:</span>
                      <p className="font-medium">{detailModal.payment.payer_id.split('-')[1].toUpperCase() + '...'}</p>
                    </div>
                    {detailModal.payment.payer && (
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="font-medium">{detailModal.payment.payer.full_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {detailModal.payment.receipt_image && (
                      <Image src={`${BASE_URL}/${detailModal.payment.receipt_image}`} className="h-4 w-4 text-purple-600" alt="Receipt" width={16} height={16} />
                    )}
                    <span className="font-medium text-gray-900">Receipt Information</span>
                  </div>
                  {detailModal.payment.receipt_image ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Receipt Image:</span>
                        <p className="text-sm font-mono text-gray-800 break-all">
                          {detailModal.payment.receipt_image}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => 
                          {
                            setDetailModal({ isOpen: false, payment: null }),
                            openImageModal(detailModal.payment!.receipt_image!, detailModal.payment!.amount.toString())
                          }
                        }
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Image src={`${BASE_URL}/${detailModal.payment.receipt_image}`} className="h-4 w-4" alt="Receipt" width={16} height={16} />
                        View Receipt Image
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No receipt image provided</p>
                  )}
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-gray-900">Additional Information</span>
                  </div>
                  <div className="space-y-2">
                    {detailModal.payment.approved_at && (
                      <div>
                        <span className="text-sm text-gray-600">Approved At:</span>
                        <p className="font-medium">
                          {new Date(detailModal.payment.approved_at).toLocaleDateString()} at{' '}
                          {new Date(detailModal.payment.approved_at).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                    {detailModal.payment.commission_id && (
                      <div>
                        <span className="text-sm text-gray-600">Commission ID:</span>
                        <p className="font-medium">{detailModal.payment.commission_id}</p>
                      </div>
                    )}
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
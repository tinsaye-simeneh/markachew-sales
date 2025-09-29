"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Receipt, Calendar, DollarSign } from 'lucide-react'
import { normalizePaymentStatus, PaymentStatus } from '@/lib/api/config'
import type { Payment } from '@/lib/api/config'


interface PaymentListProps {
  payments: Payment[]
  onViewReceipt?: (imagePath: string, paymentId: string) => void
}

export function PaymentList ({ payments, onViewReceipt }: PaymentListProps) {

  const getStatusBadge = (status: PaymentStatus) => {
    const variants = {
      [PaymentStatus.PENDING]: 'outline',
      [PaymentStatus.APPROVED]: 'default',
      [PaymentStatus.REJECTED]: 'destructive',
      [PaymentStatus.COMPLETED]: 'secondary'
    } as const

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    )
  } 

  return (
    <Card>
    
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No payments found</p>
            <p className="text-sm text-gray-500">Create your first payment to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">Payment #{payment.id.slice(-8)}</span>
                      {getStatusBadge(normalizePaymentStatus(payment.status))}
                       </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{payment.amount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {payment.receipt_image && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReceipt ? onViewReceipt(payment.receipt_image!, payment.id) : window.open(payment.receipt_image as string, '_blank')}
                    >
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
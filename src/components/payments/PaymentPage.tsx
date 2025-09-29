"use client"

import { useEffect, useState } from "react"
import { CreatePaymentForm } from "./CreatePaymentModal"
import { PaymentList } from "./PaymentList"
import { Plus, RefreshCw, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PaymentService } from "@/lib/api/payment-service"
import { toast } from "sonner"
import { Payment } from "@/lib/api/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import Image from "next/image"
  
export function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false) 
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    imageUrl: string
    paymentId: string
  }>({
    isOpen: false,
    imageUrl: '',
    paymentId: ''
  })
  const paymentService = new PaymentService()
  
  // Base URL for images
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://employee.luckbingogames.com'

  const handlePaymentSuccess = () => {
    setIsModalOpen(false)
    fetchPayments() // Refresh the payments list
  }

  // Handle image modal
  const openImageModal = (imagePath: string, paymentId: string) => {
    const fullImageUrl = `${BASE_URL}/${imagePath}`
    setImageModal({
      isOpen: true,
      imageUrl: fullImageUrl,
      paymentId: paymentId
    })
  }

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      paymentId: ''
    })
  }

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentService.getPayments()
      
        setPayments(response.payments)
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your payment submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading payments...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      

      <div className="space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Payments</h1>
      <p className="text-gray-600">
        Manage your payment submissions and track their status
      </p>
    </div>
    <div className="flex items-center justify-end">
    <Button variant="outline" className='cursor-pointer mr-4' size="sm" onClick={fetchPayments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
         
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild> 
        <div className="flex items-center justify-end">
           
        <Button className="cursor-pointer">
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Payment
          </span>
        </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Payment</DialogTitle>
        </DialogHeader>
        <CreatePaymentForm onSuccess={handlePaymentSuccess} />
      </DialogContent>
    </Dialog>
    </div>
  </div>
</div>

        <PaymentList payments={payments} onViewReceipt={openImageModal} />
      
        {/* Image Modal */}
        {imageModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Payment Receipt</CardTitle>
                    <CardDescription>
                      Payment ID: {imageModal.paymentId.split('-')[1].toUpperCase() + '...'}
                    </CardDescription>
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
                      target.src = '/placeholder-image.png' // Fallback image
                      target.alt = 'Image not found'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  )
}

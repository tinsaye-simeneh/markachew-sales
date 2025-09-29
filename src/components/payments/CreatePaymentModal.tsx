"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, DollarSign, X, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { PaymentService } from '@/lib/api/payment-service'
import { CommissionService } from '@/lib/api/commission-service'
import type { CreatePaymentRequest, Commission } from '@/lib/api/config'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface CreatePaymentFormProps {
  onSuccess?: () => void
}

export function CreatePaymentForm({ onSuccess }: CreatePaymentFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    receipt_image: null as File | null,
    commission_id: ''
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const paymentService = new PaymentService()
  const commissionService = new CommissionService()
  
  // Check if user is a seller
  const isSeller = user?.user_type === 'SELLER'

  // Fetch commissions for sellers
  useEffect(() => {
    if (isSeller) {
      const fetchCommissions = async () => {
        try {
          const data = await commissionService.getCommissions()
          setCommissions(data)
        } catch (error) {
          console.error('Error fetching commissions:', error)
          toast.error('Failed to load commission types')
        }
      }
      fetchCommissions()
    }
  }, [isSeller])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        receipt_image: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      receipt_image: null
    }))
    setImagePreview(null)
  }

  const handleCommissionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      commission_id: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.receipt_image) {
      toast.error('Please fill in all required fields')
      return
    }

    // For sellers, commission is required
    if (isSeller && !formData.commission_id) {
      toast.error('Please select a commission type')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      // Get payer_id from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        toast.error('User not found. Please login again.')
        return
      }

      const user = JSON.parse(userData)
      const payer_id = user.id

      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(formData.receipt_image!)
      })

      const paymentData: CreatePaymentRequest = {
        payer_id,
        amount,
        receipt_image: base64Image,
        ...(isSeller && formData.commission_id && { commission_id: formData.commission_id })
      }

      const response = await paymentService.createPayment(paymentData)
      if (response) {
        toast.success('Payment created successfully!')
        resetForm()
        onSuccess?.()
      }
      
        } catch (error: unknown) {
      console.error('Payment creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      amount: '',
      receipt_image: null,
      commission_id: ''
    })
    setImagePreview(null)
  }

  return (
    <div className="space-y-6" >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {isSeller && (
            <div className="space-y-2">
              <Label htmlFor="commission" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Commission Type *
              </Label>
              <Select value={formData.commission_id} onValueChange={handleCommissionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select commission type" />
                </SelectTrigger>
                <SelectContent>
                  {commissions.map((commission) => (
                    <SelectItem key={commission.id} value={commission.id}>
                      {commission.title} - ETB {commission.amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="receipt_image">Receipt Image *</Label>
            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload receipt image</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                  <Input
                    id="receipt_image"
                    name="receipt_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                <Image
  src={imagePreview || ''}
  alt="Receipt preview"
  width={400}             
  height={192}            
  className="w-full h-48 object-cover rounded-lg border"
/>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" /> Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Payment'}
            </Button>
          </div>
        </form>
    </div>
  )
}
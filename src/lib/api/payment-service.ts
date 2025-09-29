import { apiClient } from './client'
import { API_CONFIG } from './config'
import type { Payment, CreatePaymentRequest } from './config'

export class PaymentService {
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, {
      ...paymentData,
      receipt_image: paymentData.receipt_image ? paymentData.receipt_image.toString() : null
    })
    return response.data as Payment
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getPayments(): Promise<{ payments: Payment[]; meta: any }> {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}`
    )
    
    // Handle the nested response structure: { success: true, data: { payments: [], meta: {} } }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = response.data as any
    if (responseData?.data) {
      return {
        payments: responseData.data.payments || [],
        meta: responseData.data.meta || {}
      }
    }
    
    // Fallback for direct structure
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return responseData as { payments: Payment[]; meta: any }
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PAYMENTS.GET(id))
    return response.data as Payment
  }

  async updatePayment(id: string, paymentData: Partial<CreatePaymentRequest>): Promise<Payment> {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE(id), paymentData)
    return response.data as Payment
  }

  async deletePayment(id: string): Promise<void> {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.PAYMENTS.DELETE(id))
    return response.data as void
  }

  async updatePaymentStatus(id: string, status: 'Approved' | 'Rejected' | 'Pending'): Promise<Payment> {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE(id), { status })
    return response.data as Payment
  }
}
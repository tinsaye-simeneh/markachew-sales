"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Bell } from 'lucide-react'

export function SellerNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your property listings</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-gray-600">
              You will receive notifications about inquiries and updates here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
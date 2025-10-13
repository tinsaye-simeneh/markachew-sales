"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export function SellerSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
            <p className="text-gray-600">
              Account settings and preferences will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
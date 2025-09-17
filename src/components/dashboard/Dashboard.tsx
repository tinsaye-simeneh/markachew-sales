"use client"

import { Footer } from '../layout/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HouseListings } from '@/components/dashboard/HouseListings'
import { JobListings } from '@/components/dashboard/JobListings'

export function Dashboard() {
  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
        <p className="text-gray-600">Discover your next home or career opportunity</p>
      </div>
      
      <Tabs defaultValue="houses" className="w-full">
        <TabsList className="grid w-75 grid-cols-2 mb-8">
          <TabsTrigger value="houses" className="text-base cursor-pointer">
            🏠 Houses
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-base cursor-pointer">
            💼 Jobs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="houses" className="mt-0">
          <HouseListings />
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-0">
          <JobListings />
        </TabsContent>
      </Tabs>
      </div>
      <Footer />
      </>
  )
}
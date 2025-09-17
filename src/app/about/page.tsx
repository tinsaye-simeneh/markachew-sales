"use client"

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, Target, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MPEM</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting dreams with opportunities. We&apos;re your trusted platform for finding the perfect home and advancing your career.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="text-center">
              <Target className="h-12 w-12 text-[#007a7f] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To simplify the process of finding your dream home and perfect job by providing a seamless, 
                user-friendly platform that connects people with opportunities that matter.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-10 w-10 text-[#007a7f] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Properties</h3>
              <p className="text-gray-600">
                We curate only the best properties, ensuring every listing meets our high standards for quality and value.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-[#007a7f] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Building a community of verified users, reliable agents, and reputable employers you can trust.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-10 w-10 text-[#007a7f] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                Committed to delivering exceptional service and results that exceed your expectations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Founded in 2024, MPEM emerged from a simple observation: finding the right home or job shouldn&apos;t be complicated. 
                We noticed that people were struggling with fragmented platforms, unreliable information, and time-consuming processes.
              </p>
              <p className="mb-4">
                Our founders, experienced in both real estate and recruitment, decided to create a unified platform that addresses 
                these pain points. We combined the best of both worlds to offer a comprehensive solution for life&apos;s most important decisions.
              </p>
              <p>
                Today, MPEM serves thousands of users across Ethiopia, helping them find their perfect home and advance their careers 
                with confidence and ease.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
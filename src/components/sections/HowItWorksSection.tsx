"use client"

import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, Search, Heart, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in seconds and tell us what you're looking for - whether it's a home or a job.",
    step: "01"
  },
  {
    icon: Search,
    title: "Browse & Filter",
    description: "Use our advanced filters to find exactly what you need. Our AI learns your preferences.",
    step: "02"
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Save properties and jobs you love. Get notifications when similar opportunities appear.",
    step: "03"
  },
  {
    icon: CheckCircle,
    title: "Connect & Succeed",
    description: "Connect directly with sellers, employers, or agents. Make your dreams a reality.",
    step: "04"
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is simple. Follow these four easy steps to find your perfect match.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm h-full">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
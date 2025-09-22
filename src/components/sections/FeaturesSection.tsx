"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Shield, Zap, Users, TrendingUp, Smartphone, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "All properties and job postings are thoroughly verified to ensure authenticity and quality.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description: "Our advanced AI algorithm matches you with the perfect opportunities based on your preferences.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join thousands of verified users who have found their dream homes and careers with us.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Get real-time market data and trends to make informed decisions about your investments.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Access our platform anywhere, anytime with our fully responsive mobile experience.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always here to help you with any questions or concerns.",
    color: "bg-primary/10 text-primary"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Markachew?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with personalized service to help you find exactly what you&apos;re looking for.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardContent className="p-8">
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
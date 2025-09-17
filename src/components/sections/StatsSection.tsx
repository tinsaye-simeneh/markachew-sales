"use client"

import { TrendingUp, Users, Home, Briefcase } from 'lucide-react'

const stats = [
  {
    icon: Home,
    value: "10,000+",
    label: "Properties Listed",
    description: "Homes, apartments, and commercial spaces",
    color: "text-blue-600"
  },
  {
    icon: Briefcase,
    value: "5,000+",
    label: "Job Opportunities",
    description: "From entry-level to executive positions",
    color: "text-purple-600"
  },
  {
    icon: Users,
    value: "25,000+",
    label: "Active Users",
    description: "Trusted by professionals and families",
    color: "text-green-600"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    description: "Users find what they're looking for",
    color: "text-orange-600"
  }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join our growing community of successful users who have found their perfect match.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color.replace('text-', 'text-white')}`} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-blue-100 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
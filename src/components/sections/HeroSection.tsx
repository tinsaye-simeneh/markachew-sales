"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Briefcase, Users, TrendingUp } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-2000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}Dream Home{" "}
                </span>
                & Perfect Job
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with opportunities that matter. Whether you're looking for your next home 
                or your next career move, we've got you covered with AI-powered matching and 
                personalized recommendations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Explore Houses
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                Browse Jobs
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">5K+</div>
                <div className="text-sm text-gray-600">Jobs Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">25K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Smart Property Search</h3>
                    <p className="text-gray-600 mt-1">
                      AI-powered recommendations based on your preferences, budget, and lifestyle needs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Career Matching</h3>
                    <p className="text-gray-600 mt-1">
                      Connect with employers and find opportunities that align with your skills and goals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Trusted Community</h3>
                    <p className="text-gray-600 mt-1">
                      Join a verified community of buyers, sellers, employees, and employers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
                    <p className="text-gray-600 mt-1">
                      Get real-time market data and trends to make informed decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Briefcase, ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of users who have already found their perfect match. Your dream home or career is just a click away.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-[#007a7f] to-[#005a5f]">
            <CardContent className="p-8 text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Home className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Find Your Dream Home
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Browse thousands of verified properties and find the perfect place to call home.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-[#007a7f] hover:bg-gray-100 group-hover:scale-105 transition-transform"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-[#007a7f] to-[#005a5f]">
            <CardContent className="p-8 text-center text-white">
              <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Advance Your Career
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Discover exciting job opportunities and connect with top employers in your field.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-[#007a7f] hover:bg-gray-100 group-hover:scale-105 transition-transform"
              >
                Find Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Already have an account?
          </p>
          <Button variant="outline" size="lg" className="border-white text-gray-900 hover:bg-white hover:text-primary hover:border-primary cursor-pointer">
            Sign In
          </Button>
        </div>
      </div>
    </section>
  )
}
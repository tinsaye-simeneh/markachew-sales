"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { COMPANY_FULL_NAME } from '@/lib/constants'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    image: "",
    content: `${COMPANY_FULL_NAME} helped me find my dream apartment in just 2 weeks! The AI matching was incredibly accurate and saved me so much time.`,
    rating: 5,
    type: "Property"
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    company: "Creative Agency",
    image: "",
    content: `I landed my dream job through ${COMPANY_FULL_NAME}. The platform connected me with the perfect company that matched my skills and values.`,
    rating: 5,
    type: "Job"
  },
  {
    name: "Emily Rodriguez",
    role: "Real Estate Agent",
    company: "Premier Properties",
    image: "",
    content: `As a real estate agent, ${COMPANY_FULL_NAME} has been invaluable for finding qualified buyers. The quality of leads is outstanding.`,
    rating: 5,
    type: "Property"
  },
  {
    name: "David Thompson",
    role: "Product Designer",
    company: "StartupXYZ",
    image: "",
    content: "The job search process was so smooth. I found multiple opportunities that were perfect fits for my career goals.",
    rating: 5,
    type: "Job"
  },
  {
    name: "Lisa Wang",
    role: "HR Director",
    company: "Global Corp",
    image: "",
    content: `We've hired 15 amazing employees through ${COMPANY_FULL_NAME}. The platform attracts high-quality candidates.`,
    rating: 5,
    type: "Job"
  },
  {
    name: "Robert Kim",
    role: "Home Buyer",
    company: "",
    image: "",
    content: `After months of searching, ${COMPANY_FULL_NAME} found me the perfect family home. The process was transparent and stress-free.`,
    rating: 5,
    type: "Property"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what real users have to say about their experience with {COMPANY_FULL_NAME}.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </div>
                    <div className="text-xs text-primary font-medium mt-1">
                      {testimonial.type} Success Story
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
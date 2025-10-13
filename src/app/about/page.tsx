"use client"

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { COMPANY_DISPLAY_NAME, COMPANY_EMAIL, COMPANY_PHONE } from '@/lib/constants'
import { 
    Users, 
  Target, 
  TrendingUp, 
  Globe, 
  Heart, 
  Shield, 
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  User,
  Briefcase,
  Home
} from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "Properties Listed", value: "5,000+", icon: Home },
    { label: "Jobs Posted", value: "2,500+", icon: Briefcase },
    { label: "Successful Matches", value: "8,000+", icon: Heart },
  ]

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "/images/team/sarah.jpg",
      description: "Former real estate executive with 15+ years experience in property development and market analysis."
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder", 
      image: "/images/team/michael.jpg",
      description: "Tech entrepreneur and software architect specializing in scalable platform development."
    },
    {
      name: "Amina Hassan",
      role: "Head of Operations",
      image: "/images/team/amina.jpg", 
      description: "Operations expert with deep knowledge of Ethiopian real estate and employment markets."
    },
    {
      name: "David Kim",
      role: "Head of Product",
      image: "/images/team/david.jpg",
      description: "Product strategist focused on user experience and platform optimization."
    }
  ]

  const milestones = [
    { year: "2024", title: "Company Founded", description: "Started with a vision to revolutionize property and job search in Ethiopia" },
    { year: "2024", title: "Platform Launch", description: "Launched our unified platform for real estate and employment" },
    { year: "2024", title: "10K Users", description: "Reached our first 10,000 registered users milestone" },
    { year: "2025", title: "Expansion", description: "Expanding services to major cities across Ethiopia" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 text-primary border-primary">
              <Star className="h-3 w-3 mr-1" />
              Trusted by 10,000+ Users
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-primary">{COMPANY_DISPLAY_NAME}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We&apos;re revolutionizing how people find their dream homes and perfect careers in Ethiopia. 
              Our platform connects opportunities with ambition, making life&apos;s most important decisions simple and successful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="cursor-pointer">
                <Briefcase className="h-4 w-4 mr-2" />
                Find Your Dream Job
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                Discover Your Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To democratize access to quality housing and career opportunities by creating a transparent, 
                  efficient, and user-friendly platform that connects people with their dreams.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become Ethiopia&apos;s leading platform for real estate and employment, 
                  empowering millions to find their perfect home and advance their careers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape our commitment to our users
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Security</h3>
                <p className="text-gray-600">
                  We prioritize the safety and security of our users with verified listings, 
                  secure transactions, and transparent processes.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
                <p className="text-gray-600">
                  Building a supportive community where users help each other succeed 
                  in finding homes and advancing careers.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Continuously improving our platform with cutting-edge technology 
                  and user-centered design to deliver exceptional experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind {COMPANY_DISPLAY_NAME}&apos;s success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to transform real estate and employment in Ethiopia
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">{milestone.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <Card className="mb-20">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                How we started and where we&apos;re heading
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p>
                Founded in 2024, {COMPANY_DISPLAY_NAME} emerged from a simple yet powerful observation: 
                finding the right home or job shouldn&apos;t be complicated, time-consuming, or stressful. 
                Our founders, having experienced the challenges of fragmented platforms and unreliable information firsthand, 
                decided to create something better.
              </p>
              
              <p>
                With backgrounds in real estate, technology, and operations, our team combined their expertise 
                to build a unified platform that addresses the pain points of traditional property and job search. 
                We believe that everyone deserves access to quality opportunities, regardless of their background or location.
              </p>
              
              <p>
                Today, {COMPANY_DISPLAY_NAME} serves thousands of users across Ethiopia, from first-time home buyers 
                to experienced professionals seeking career advancement. We&apos;re proud to have facilitated thousands 
                of successful matches and continue to innovate to make the process even better.
              </p>
              
              <p>
                As we look to the future, we remain committed to our mission of connecting dreams with opportunities, 
                expanding our reach, and continuously improving the experience for our growing community.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-primary text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl mb-8 opacity-90">
              Have questions or want to learn more? We&apos;d love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="opacity-90">{COMPANY_EMAIL}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90">{COMPANY_PHONE}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="opacity-90">Addis Ababa, Ethiopia</p>
              </div>
            </div>
            
            <Button size="lg" variant="secondary" className="cursor-pointer">
              <ArrowRight className="h-4 w-4 mr-2" />
              Contact Us Today
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
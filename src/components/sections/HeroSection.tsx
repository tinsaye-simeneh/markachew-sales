"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Briefcase, Users, TrendingUp, Sparkles, ArrowRight, Star } from 'lucide-react'
import { motion, Variants  } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoginModal } from '../auth/LoginModal'
import { RegisterModal } from '../auth/RegisterModal'

export function HeroSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const cardVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  const handleJobsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      router.push('/jobs')
    } else {
      setIsLoginOpen(true)
    }
  }

  const handleHousesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      router.push('/houses')
    } else {
      setIsLoginOpen(true)
    }
  }


  const handleCloseModals = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(false)
  }


  return (
    <>
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* Floating Animated Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full"
        variants={floatingVariants as Variants}
        animate="float"
        style={{ animationDelay: '0s' }}
      />
      <motion.div 
        className="absolute top-40 right-20 w-16 h-16 bg-primary/15 rounded-full"
        variants={floatingVariants as Variants}
        animate="float"
        style={{ animationDelay: '2s' }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/25 rounded-full"
        variants={floatingVariants as Variants}
        animate="float"
        style={{ animationDelay: '4s' }}
      />
      
      {/* Sparkle Effects */}
      <motion.div
        className="absolute top-32 right-1/3"
        variants={pulseVariants as Variants}
        animate="pulse"
      >
        <Sparkles className="h-6 w-6 text-primary" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/3"
        variants={pulseVariants as Variants}
        animate="pulse"
        style={{ animationDelay: '1.5s' }}
      >
        <Star className="h-4 w-4 text-primary" />
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="space-y-8" variants={itemVariants as Variants}>
            <div className="space-y-6">
              <motion.div
                variants={textRevealVariants as Variants}
                className="relative"
              >
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                  variants={textRevealVariants as Variants}
                >
                  Find Your
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#005a5f] block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Dream Home
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    & Perfect Job
                  </motion.span>
                </motion.h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed"
                variants={textRevealVariants as Variants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Connect with opportunities that matter. Whether you&apos;re looking for your next home 
                or your next career move, we&apos;ve got you covered with AI-powered matching and 
                personalized recommendations.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants as Variants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-[#005a5f] text-white cursor-pointer group" onClick={handleHousesClick}>
                  <span>Explore Houses</span>
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer" onClick={handleJobsClick}>
                  Browse Jobs
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8"
              variants={itemVariants as Variants}
            >
              {[
                { number: "10K+", label: "Properties Listed" },
                { number: "5K+", label: "Jobs Available" },
                { number: "25K+", label: "Happy Users" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 0.5, type: "spring" }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right Content - Animated Feature Cards */}
          <motion.div className="space-y-6" variants={containerVariants}>
            {[
              {
                icon: Home,
                title: "Smart Property Search",
                description: "AI-powered recommendations based on your preferences, budget, and lifestyle needs."
              },
              {
                icon: Briefcase,
                title: "Career Matching",
                description: "Connect with employers and find opportunities that align with your skills and goals."
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Join a verified community of buyers, sellers, employees, and employers."
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                description: "Get real-time market data and trends to make informed decisions."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants as Variants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 + index * 0.2 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className="p-3 bg-primary/10 rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
      <LoginModal
      isOpen={isLoginOpen}
      onClose={handleCloseModals}
      onSwitchToRegister={() => {
        handleCloseModals()
        setIsRegisterOpen(true)
      }}
    />
     <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={() => {
          handleCloseModals()
          setIsLoginOpen(true)
        }}
      />
    </>
  )
}
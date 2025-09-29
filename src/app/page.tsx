"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { StatsSection } from "@/components/sections/StatsSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { CTASection } from "@/components/sections/CTASection"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { LoadingPage } from "@/components/ui/loading"
import { UserType } from "@/lib/api"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && (user.user_type === UserType.ADMIN || user.user_type === UserType.SUPER_ADMIN)) {
      router.push('/admin')
    }
  }, [user, router])

  if (isLoading) {
    return <LoadingPage />
  }

  if (user && (user.user_type === UserType.ADMIN || user.user_type === UserType.SUPER_ADMIN)) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hide navbar for EMPLOYER and SELLER user types */}
      {user && (user.user_type === UserType.EMPLOYER || user.user_type === UserType.SELLER) ? null : (
        <Navbar />
      )}
      {user ? (
        <Dashboard />
      ) : (
        <>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <StatsSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </>
      )}
    </div>
  )
}

"use client"

import { useAuth } from "@/contexts/AuthContext"
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

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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

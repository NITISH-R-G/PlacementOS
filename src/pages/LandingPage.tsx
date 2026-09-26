import React from 'react'
import { BackgroundVideo } from '@/components/landing/BackgroundVideo'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { StatsFooter } from '@/components/landing/StatsFooter'
import { usePlacementStore } from '@/store/usePlacementStore'

export const LandingPage: React.FC = () => {
  const { setActiveTab, resetToFreshOnboarding } = usePlacementStore()

  const handleNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  const handleStartOnboarding = () => {
    resetToFreshOnboarding()
    setActiveTab('onboarding')
  }

  const handleSignIn = () => {
    setActiveTab('dashboard')
  }

  return (
    <div className="landing-page-root">
      {/* Viewport background video */}
      <BackgroundVideo />

      {/* Region 1: Header at the top (flex-shrink: 0) */}
      <Header
        activeItem="landing"
        onNavigate={handleNavigate}
        onSignIn={handleSignIn}
      />

      {/* Region 2: Hero centered in remaining space (flex: 1) */}
      <Hero onStartOnboarding={handleStartOnboarding} />

      {/* Region 3: Stats footer at the bottom (flex-shrink: 0) */}
      <StatsFooter />
    </div>
  )
}

export default LandingPage

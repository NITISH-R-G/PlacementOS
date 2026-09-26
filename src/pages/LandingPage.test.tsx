import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LandingPage } from './LandingPage'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('LandingPage', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('renders landing page hero and key sections', () => {
    render(<LandingPage />)

    expect(screen.getByText(/Prepare With/i)).toBeInTheDocument()
    expect(screen.getByText(/Intelligence/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /build my roadmap/i })
    ).toBeInTheDocument()
  })

  it('navigates to onboarding when CTA button is clicked', () => {
    render(<LandingPage />)

    const ctaButton = screen.getByRole('button', { name: /build my roadmap/i })
    fireEvent.click(ctaButton)

    const state = usePlacementStore.getState()
    expect(state.activeTab).toBe('onboarding')
    expect(state.profile.onboardingCompleted).toBe(false)
  })

  it('navigates to dashboard when Sign In is clicked', () => {
    render(<LandingPage />)

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(signInButton)

    expect(usePlacementStore.getState().activeTab).toBe('dashboard')
  })
})

import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingFlow } from './OnboardingFlow'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('OnboardingFlow - Core User Personalization Journey', () => {
  beforeEach(() => {
    usePlacementStore.getState().resetToFreshOnboarding()
  })

  it('renders Step 1: Profile Setup with default values and inputs', () => {
    render(<OnboardingFlow />)

    expect(screen.getByText(/Tell us about your placement goals/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Arjun Sharma')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /proceed to diagnostic assessment/i })
    ).toBeInTheDocument()
  })

  it('allows user input modification on Step 1', () => {
    render(<OnboardingFlow />)

    const nameInput = screen.getByDisplayValue('Arjun Sharma')
    fireEvent.change(nameInput, { target: { value: 'Priya Patel' } })
    expect(screen.getByDisplayValue('Priya Patel')).toBeInTheDocument()
  })

  it('transitions from Step 1 to Step 2 upon clicking Proceed', () => {
    render(<OnboardingFlow />)

    const proceedBtn = screen.getByRole('button', {
      name: /proceed to diagnostic assessment/i,
    })
    fireEvent.click(proceedBtn)

    // Should now show Question 1 of diagnostic
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument()
  })

  it('supports selecting option, checking answer, and progressing to next question', () => {
    render(<OnboardingFlow />)

    // Move to step 2
    fireEvent.click(
      screen.getByRole('button', { name: /proceed to diagnostic assessment/i })
    )

    // Find first option and click it
    const options = screen.getAllByRole('button')
    const firstOption = options.find((btn) => btn.className.includes('border-zinc-800'))
    expect(firstOption).toBeDefined()
    if (firstOption) fireEvent.click(firstOption)

    // Check Answer button should now be enabled
    const checkBtn = screen.getByRole('button', { name: /check answer/i })
    expect(checkBtn).not.toBeDisabled()
    fireEvent.click(checkBtn)

    // Engineering concept explanation should appear
    expect(screen.getByText(/Engineering Concept:/i)).toBeInTheDocument()

    // Next question button should appear
    const nextBtn = screen.getByRole('button', { name: /next question/i })
    expect(nextBtn).toBeInTheDocument()
    fireEvent.click(nextBtn)

    // Now at Question 2
    expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PracticeView } from './PracticeView'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('PracticeView - Drills & AI Feedback Evaluator', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('renders practice lab header and category filter pills', () => {
    render(<PracticeView />)

    expect(screen.getByText(/Placement Practice Lab/i)).toBeInTheDocument()
    expect(screen.getByText('All Categories')).toBeInTheDocument()
    expect(screen.getAllByText('DSA').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('CS Fundamentals').length).toBeGreaterThanOrEqual(1)
  })

  it('filters problem list when a category is selected', () => {
    render(<PracticeView />)

    const sqlFilter = screen.getByRole('button', { name: 'SQL' })
    fireEvent.click(sqlFilter)
    expect(sqlFilter).toHaveClass('bg-indigo-600')
  })

  it('disables evaluate button when solution textarea is empty', () => {
    render(<PracticeView />)

    const evaluateBtn = screen.getByRole('button', { name: /run feedback evaluator/i })
    expect(evaluateBtn).toBeDisabled()
  })

  it('enables evaluate button upon typing and renders evaluation results on submission', async () => {
    render(<PracticeView />)

    const textarea = screen.getByPlaceholderText(/write your explanation or code here/i)
    fireEvent.change(textarea, {
      target: {
        value: 'Two pointer approach: initialize left=0, right=n-1, compute window sum.',
      },
    })

    const evaluateBtn = screen.getByRole('button', { name: /run feedback evaluator/i })
    expect(evaluateBtn).not.toBeDisabled()

    fireEvent.click(evaluateBtn)

    expect(screen.getByText(/Analyzing Approach.../i)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByText(/Score: 85\/100/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('allows marking drill as completed', () => {
    render(<PracticeView />)

    const markButtons = screen.getAllByRole('button', { name: /mark done|marked as completed/i })
    expect(markButtons.length).toBeGreaterThan(0)
    fireEvent.click(markButtons[0])
  })
})

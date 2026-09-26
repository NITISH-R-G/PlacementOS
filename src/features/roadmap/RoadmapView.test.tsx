import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RoadmapView } from './RoadmapView'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('RoadmapView - 4-Phase Personalized Roadmap', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('renders roadmap header with target role and countdown context', () => {
    render(<RoadmapView />)

    expect(
      screen.getByText(/Adaptive Placement Preparation Roadmap/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Target Role:/i)).toBeInTheDocument()
  })

  it('renders all 4 phases of the roadmap sequence', () => {
    render(<RoadmapView />)

    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.getByText('P2')).toBeInTheDocument()
    expect(screen.getByText('P3')).toBeInTheDocument()
    expect(screen.getByText('P4')).toBeInTheDocument()
  })

  it('navigates back to dashboard when Back button is clicked', () => {
    render(<RoadmapView />)

    const backBtn = screen.getByRole('button', { name: /back to dashboard/i })
    fireEvent.click(backBtn)

    expect(usePlacementStore.getState().activeTab).toBe('dashboard')
  })
})

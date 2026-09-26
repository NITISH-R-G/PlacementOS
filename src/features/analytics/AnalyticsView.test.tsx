import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnalyticsView } from './AnalyticsView'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('AnalyticsView - Telemetry & Readiness Velocity', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('renders analytics header and key metric summary cards', () => {
    render(<AnalyticsView />)

    expect(
      screen.getByText(/Preparation Analytics & Readiness Velocity/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Aggregate Readiness/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Consistency Streak/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Time Invested/i)).toBeInTheDocument()
    expect(screen.getByText(/Drills Completed/i)).toBeInTheDocument()
  })

  it('displays the dimensional skill breakdown section', () => {
    render(<AnalyticsView />)

    expect(
      screen.getByText(/Dimensional Readiness Breakdown/i)
    ).toBeInTheDocument()
  })
})

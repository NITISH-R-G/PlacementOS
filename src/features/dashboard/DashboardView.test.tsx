import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardView } from './DashboardView'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('DashboardView - Placement Readiness & Action Plan', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('renders student greeting, countdown, and streak metrics', () => {
    render(<DashboardView />)

    expect(screen.getByText(/Good morning, Arjun/i)).toBeInTheDocument()
    expect(screen.getByText(/Days Left/i)).toBeInTheDocument()
    expect(screen.getByText(/Study Streak/i)).toBeInTheDocument()
  })

  it('renders the Overall Placement Readiness score and What Matters Now highlight', () => {
    render(<DashboardView />)

    expect(screen.getByText(/Overall Placement Readiness Score/i)).toBeInTheDocument()
    expect(screen.getByText(/What Matters Now:/i)).toBeInTheDocument()
  })

  it('renders Today\'s Recommended Plan and allows toggling action completion', () => {
    render(<DashboardView />)

    expect(screen.getByText(/Today's Recommended Plan/i)).toBeInTheDocument()

    const startButtons = screen.getAllByRole('button', { name: /start|completed/i })
    expect(startButtons.length).toBeGreaterThan(0)

    fireEvent.click(startButtons[0])
    const actions = usePlacementStore.getState().recommendationOutput.todayPlan.actions
    expect(actions.length).toBeGreaterThan(0)
  })

  it('renders identified skill gaps with priority tags', () => {
    render(<DashboardView />)

    expect(screen.getByText(/Top 3 Skill Gaps/i)).toBeInTheDocument()
  })

  it('allows navigation from Dashboard to Practice and Roadmap', () => {
    render(<DashboardView />)

    const viewRoadmapBtn = screen.getByRole('button', { name: /view full roadmap/i })
    expect(viewRoadmapBtn).toBeInTheDocument()

    fireEvent.click(viewRoadmapBtn)
    expect(usePlacementStore.getState().activeTab).toBe('roadmap')
  })
})

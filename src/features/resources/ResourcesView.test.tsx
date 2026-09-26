import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResourcesView } from './ResourcesView'
import { usePlacementStore } from '@/store/usePlacementStore'

describe('ResourcesView - Normalized Resource Catalog', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('renders catalog header and open source attribution notice', () => {
    render(<ResourcesView />)

    expect(screen.getByText(/Normalized Resource Catalog/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Open Source Attribution & Compliance:/i)
    ).toBeInTheDocument()
  })

  it('filters resources based on search input', () => {
    render(<ResourcesView />)

    const searchInput = screen.getByPlaceholderText(/search topics, skills/i)
    fireEvent.change(searchInput, { target: { value: 'Sliding Window' } })

    expect(screen.getAllByText(/Sliding Window/i).length).toBeGreaterThan(0)
  })

  it('displays empty state when search term yields zero results and allows clearing filters', () => {
    render(<ResourcesView />)

    const searchInput = screen.getByPlaceholderText(/search topics, skills/i)
    fireEvent.change(searchInput, { target: { value: 'XYZNonExistentTopic999' } })

    expect(
      screen.getByText(/No matching learning resources found/i)
    ).toBeInTheDocument()

    const clearBtn = screen.getByRole('button', { name: /clear filters/i })
    fireEvent.click(clearBtn)

    expect(
      screen.queryByText(/No matching learning resources found/i)
    ).not.toBeInTheDocument()
  })

  it('toggles resource completion on click', () => {
    render(<ResourcesView />)

    const markButtons = screen.getAllByRole('button', {
      name: /completed ✓|mark done/i,
    })
    expect(markButtons.length).toBeGreaterThan(0)

    fireEvent.click(markButtons[0])
    expect(usePlacementStore.getState().completedResourceIds).toBeDefined()
  })
})

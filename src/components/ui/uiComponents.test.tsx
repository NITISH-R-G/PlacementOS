import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'
import { Badge } from './badge'
import { Progress } from './progress'

describe('Reusable UI Components', () => {
  describe('Button component', () => {
    it('renders with children text and responds to click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Start Preparing</Button>)

      const button = screen.getByRole('button', { name: /start preparing/i })
      expect(button).toBeInTheDocument()

      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders disabled state and prevents click handler invocation', () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled Action
        </Button>
      )

      const button = screen.getByRole('button', { name: /disabled action/i })
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies variant classes correctly', () => {
      const { rerender } = render(<Button variant="glow">Glow Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('from-indigo-500')

      rerender(<Button variant="outline">Outline Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('border')
    })
  })

  describe('Card component suite', () => {
    it('renders Card with header, title, description, and content correctly', () => {
      render(
        <Card className="test-card">
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Identified weaknesses</CardDescription>
          </CardHeader>
          <CardContent>
            <p>DSA graph traversal needs attention.</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Skill Gap Analysis')).toBeInTheDocument()
      expect(screen.getByText('Identified weaknesses')).toBeInTheDocument()
      expect(screen.getByText('DSA graph traversal needs attention.')).toBeInTheDocument()
    })
  })

  describe('Badge component', () => {
    it('renders different color variants', () => {
      const { rerender } = render(<Badge variant="success">Optimal</Badge>)
      expect(screen.getByText('Optimal')).toHaveClass('bg-emerald-500/10')

      rerender(<Badge variant="destructive">Critical Gap</Badge>)
      expect(screen.getByText('Critical Gap')).toHaveClass('bg-rose-500/10')
    })
  })

  describe('Progress component (Accessibility)', () => {
    it('renders with role="progressbar" and appropriate ARIA attributes', () => {
      render(<Progress value={65} aria-label="Placement readiness" />)

      const progress = screen.getByRole('progressbar', { name: /placement readiness/i })
      expect(progress).toBeInTheDocument()
      expect(progress).toHaveAttribute('aria-valuenow', '65')
      expect(progress).toHaveAttribute('aria-valuemin', '0')
      expect(progress).toHaveAttribute('aria-valuemax', '100')
    })

    it('clamps values below 0 and above 100 defensively', () => {
      const { rerender } = render(<Progress value={-10} aria-label="Underflow test" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

      rerender(<Progress value={150} aria-label="Overflow test" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })
  })
})

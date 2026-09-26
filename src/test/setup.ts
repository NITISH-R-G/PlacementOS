import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = () => null
  unobserve = () => null
  disconnect = () => null
}
window.IntersectionObserver = MockIntersectionObserver as any

// Mock ResizeObserver
class MockResizeObserver {
  observe = () => null
  unobserve = () => null
  disconnect = () => null
}
window.ResizeObserver = MockResizeObserver as any

// Mock Recharts ResponsiveContainer to avoid 0-size calculation in JSDOM
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<Record<string, any>>()
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { style: { width: 500, height: 300 } }, children),
  }
})

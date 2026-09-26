import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('combines simple class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('filters out falsy and undefined values', () => {
    expect(cn('base-class', (false as boolean) && 'hidden', null, undefined, '', 'active')).toBe(
      'base-class active'
    )
  })

  it('resolves conflicting tailwind classes cleanly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    expect(cn('text-sm text-gray-500', 'text-lg text-white')).toBe('text-lg text-white')
  })

  it('handles conditional object syntax', () => {
    expect(cn('btn', { 'btn-active': true, 'btn-disabled': false })).toBe('btn btn-active')
  })
})

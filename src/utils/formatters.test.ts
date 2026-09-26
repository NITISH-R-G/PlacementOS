import { describe, it, expect } from 'vitest'
import {
  formatDaysRemaining,
  formatDurationMinutes,
  formatRoleName,
} from './formatters'

describe('formatters utility functions', () => {
  describe('formatDaysRemaining', () => {
    it('returns placement season active for 0 or negative days', () => {
      expect(formatDaysRemaining(0)).toBe('Placement season active')
      expect(formatDaysRemaining(-5)).toBe('Placement season active')
    })

    it('returns singular day message for 1 day', () => {
      expect(formatDaysRemaining(1)).toBe('1 day remaining')
    })

    it('returns plural days message for > 1 day', () => {
      expect(formatDaysRemaining(45)).toBe('45 days remaining')
      expect(formatDaysRemaining(120)).toBe('120 days remaining')
    })
  })

  describe('formatDurationMinutes', () => {
    it('formats durations less than 60 minutes', () => {
      expect(formatDurationMinutes(15)).toBe('15m')
      expect(formatDurationMinutes(45)).toBe('45m')
      expect(formatDurationMinutes(0)).toBe('0m')
    })

    it('formats exact hour durations', () => {
      expect(formatDurationMinutes(60)).toBe('1h')
      expect(formatDurationMinutes(120)).toBe('2h')
    })

    it('formats hours and remaining minutes', () => {
      expect(formatDurationMinutes(75)).toBe('1h 15m')
      expect(formatDurationMinutes(150)).toBe('2h 30m')
    })
  })

  describe('formatRoleName', () => {
    it('converts snake_case role strings to Title Case with spaces', () => {
      expect(formatRoleName('software_engineer')).toBe('Software Engineer')
      expect(formatRoleName('frontend_developer')).toBe('Frontend Developer')
      expect(formatRoleName('data_analyst')).toBe('Data Analyst')
      expect(formatRoleName('ai_ml_engineer')).toBe('Ai Ml Engineer')
    })

    it('handles single word roles', () => {
      expect(formatRoleName('frontend')).toBe('Frontend')
    })
  })
})

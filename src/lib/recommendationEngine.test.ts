import { describe, it, expect } from 'vitest'
import { generatePersonalizedPlan, ROLE_WEIGHTS } from './recommendationEngine'
import { RecommendationEngineInput, TargetRole } from '../types'

describe('Personalization / Recommendation Engine', () => {
  it('has valid role weight configurations summing to ~1.0 for each role', () => {
    const roles: TargetRole[] = [
      'software_engineer',
      'frontend_developer',
      'backend_developer',
      'data_analyst',
      'data_scientist',
      'aiml_engineer',
      'product_tech',
    ]

    roles.forEach((role) => {
      const weights = ROLE_WEIGHTS[role]
      expect(weights).toBeDefined()
      const sum = Object.values(weights).reduce((acc, w) => acc + w, 0)
      expect(sum).toBeGreaterThanOrEqual(0.95)
      expect(sum).toBeLessThanOrEqual(1.05)
    })
  })

  it('prioritizes DSA for Software Engineer role with low DSA score', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'intermediate',
      dimensionScores: {
        dsa: 30,
        cs_fundamentals: 70,
        programming: 70,
        sql: 80,
      },
      availableDailyHours: 2,
      daysUntilPlacement: 73,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.overallScore).toBeGreaterThan(0)
    expect(output.overallScore).toBeLessThanOrEqual(100)
    expect(output.skillGaps.length).toBeGreaterThanOrEqual(1)
    expect(output.skillGaps[0].dimension).toBe('dsa')
    expect(output.whatMattersNow).toContain('DSA & Algorithms')
  })

  it('prioritizes development for Frontend Developer role with low dev score', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'frontend_developer',
      currentSkillLevel: 'intermediate',
      dimensionScores: {
        development: 25,
        projects: 30,
        dsa: 80,
      },
      availableDailyHours: 2,
      daysUntilPlacement: 60,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.skillGaps[0].dimension).toBe('development')
    expect(output.whatMattersNow).toContain('Full-Stack Development')
  })

  it('prioritizes SQL for Data Analyst role with low SQL score', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'data_analyst',
      currentSkillLevel: 'beginner',
      dimensionScores: {
        sql: 25,
        aptitude: 60,
        dsa: 80,
      },
      availableDailyHours: 1.5,
      daysUntilPlacement: 60,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.skillGaps[0].dimension).toBe('sql')
    expect(output.whatMattersNow).toContain('SQL')
  })

  it('respects available daily hours in the Today plan', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'beginner',
      dimensionScores: {},
      availableDailyHours: 1, // 60 minutes
      daysUntilPlacement: 45,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.todayPlan.actions.length).toBeGreaterThan(0)
    expect(output.todayPlan.availableMinutes).toBe(60)
  })

  it('handles edge case of 0 available hours with sensible default budget', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'intermediate',
      dimensionScores: {},
      availableDailyHours: 0,
      daysUntilPlacement: 30,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.todayPlan.availableMinutes).toBe(120)
    expect(Number.isNaN(output.overallScore)).toBe(false)
  })

  it('handles edge case of 0 or negative days until placement gracefully', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'advanced',
      dimensionScores: {},
      availableDailyHours: 2,
      daysUntilPlacement: 0,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.roadmap.length).toBe(4)
    expect(Number.isNaN(output.overallScore)).toBe(false)
  })

  it('excludes already completed resources from recommendations', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'intermediate',
      dimensionScores: { dsa: 30 },
      availableDailyHours: 3,
      daysUntilPlacement: 50,
      completedResourceIds: ['res-dsa-01'],
    }

    const output = generatePersonalizedPlan(input)

    const recIds = output.recommendedResources.map((r) => r.id)
    expect(recIds).not.toContain('res-dsa-01')
  })

  it('generates a 4-phase adaptive roadmap spanning days until placement', () => {
    const input: RecommendationEngineInput = {
      targetRole: 'backend_developer',
      currentSkillLevel: 'intermediate',
      dimensionScores: {},
      availableDailyHours: 2,
      daysUntilPlacement: 90,
      completedResourceIds: [],
    }

    const output = generatePersonalizedPlan(input)

    expect(output.roadmap.length).toBe(4)
    expect(output.roadmap[0].isCurrent).toBe(true)
    expect(output.roadmap[0].daysWindow).toContain('Days 1 -')
  })

  it('accurately raises overallScore when all dimension scores are high', () => {
    const beginnerInput: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'beginner',
      dimensionScores: { dsa: 20, cs_fundamentals: 20 },
      availableDailyHours: 2,
      daysUntilPlacement: 60,
      completedResourceIds: [],
    }
    const advancedInput: RecommendationEngineInput = {
      targetRole: 'software_engineer',
      currentSkillLevel: 'advanced',
      dimensionScores: { dsa: 90, cs_fundamentals: 90, programming: 90 },
      availableDailyHours: 2,
      daysUntilPlacement: 60,
      completedResourceIds: [],
    }

    const beginnerOutput = generatePersonalizedPlan(beginnerInput)
    const advancedOutput = generatePersonalizedPlan(advancedInput)

    expect(advancedOutput.overallScore).toBeGreaterThan(beginnerOutput.overallScore)
  })
})

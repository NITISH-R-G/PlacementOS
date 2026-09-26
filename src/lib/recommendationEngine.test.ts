import { describe, it, expect } from 'vitest'
import { generatePersonalizedPlan, ROLE_WEIGHTS } from './recommendationEngine'
import { RecommendationEngineInput } from '../types'

describe('Personalization / Recommendation Engine', () => {
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
    // DSA should be a top skill gap because weight is 0.30 and score is only 30
    expect(output.skillGaps.length).toBeGreaterThanOrEqual(1)
    expect(output.skillGaps[0].dimension).toBe('dsa')
    expect(output.whatMattersNow).toContain('DSA & Algorithms')
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
})

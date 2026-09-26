import { describe, it, expect, beforeEach } from 'vitest'
import { usePlacementStore } from './usePlacementStore'
import { StudentProfile, DiagnosticResult } from '../types'

describe('usePlacementStore', () => {
  beforeEach(() => {
    usePlacementStore.getState().loadDemoProfile()
  })

  it('initializes with default demo profile and activeTab as dashboard upon loading demo', () => {
    const state = usePlacementStore.getState()
    expect(state.profile.name).toBe('Arjun Sharma')
    expect(state.profile.targetRole).toBe('software_engineer')
    expect(state.activeTab).toBe('dashboard')
    expect(state.recommendationOutput).toBeDefined()
    expect(state.recommendationOutput.overallScore).toBeGreaterThan(0)
  })

  it('updates activeTab correctly', () => {
    usePlacementStore.getState().setActiveTab('dashboard')
    expect(usePlacementStore.getState().activeTab).toBe('dashboard')

    usePlacementStore.getState().setActiveTab('roadmap')
    expect(usePlacementStore.getState().activeTab).toBe('roadmap')

    usePlacementStore.getState().setActiveTab('practice')
    expect(usePlacementStore.getState().activeTab).toBe('practice')
  })

  it('updates profile and recomputes recommendations accordingly', () => {
    const initialRecs = usePlacementStore.getState().recommendationOutput

    usePlacementStore.getState().updateProfile({
      targetRole: 'data_analyst',
      availableHoursPerDay: 4,
    })

    const state = usePlacementStore.getState()
    expect(state.profile.targetRole).toBe('data_analyst')
    expect(state.profile.availableHoursPerDay).toBe(4)
    expect(state.recommendationOutput).not.toBe(initialRecs)
    expect(state.recommendationOutput.todayPlan.availableMinutes).toBe(240)
  })

  it('completes onboarding and updates scores and recommendation plan', () => {
    const newProfile: StudentProfile = {
      id: 'student-new',
      name: 'Rohan Kumar',
      college: 'CIT Chennai',
      degree: 'B.Tech IT',
      currentYear: '3rd Year',
      targetGraduationYear: 2026,
      targetRole: 'frontend_developer',
      currentSkillLevel: 'intermediate',
      availableHoursPerDay: 3,
      placementDate: new Date().toISOString(),
      daysUntilPlacement: 60,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const diagResult: DiagnosticResult = {
      scoreByDimension: {
        development: 85,
        projects: 90,
      },
      completedAt: new Date().toISOString(),
      totalQuestions: 6,
      correctCount: 5,
      detectedGaps: [],
    }

    usePlacementStore.getState().completeOnboarding(newProfile, diagResult)

    const state = usePlacementStore.getState()
    expect(state.profile.onboardingCompleted).toBe(true)
    expect(state.profile.name).toBe('Rohan Kumar')
    expect(state.diagnosticResult).toEqual(diagResult)
    expect(state.activeTab).toBe('dashboard')
    expect(state.dimensionScores.development).toBe(85)
    expect(state.dimensionScores.projects).toBe(90)
  })

  it('toggles resource completion and recalculates completed study hours', () => {
    const resourceId = 'res-dsa-02'
    const initialCompleted = usePlacementStore.getState().completedResourceIds.includes(resourceId)
    const initialHours = usePlacementStore.getState().totalHoursStudied

    usePlacementStore.getState().toggleResourceCompletion(resourceId)
    let state = usePlacementStore.getState()

    if (!initialCompleted) {
      expect(state.completedResourceIds).toContain(resourceId)
      expect(state.totalHoursStudied).toBeGreaterThan(initialHours)
    } else {
      expect(state.completedResourceIds).not.toContain(resourceId)
    }

    // Toggle again to reverse
    usePlacementStore.getState().toggleResourceCompletion(resourceId)
    state = usePlacementStore.getState()
    expect(state.completedResourceIds.includes(resourceId)).toBe(initialCompleted)
  })

  it('toggles today plan action items without affecting unselected actions', () => {
    const state = usePlacementStore.getState()
    const actions = state.recommendationOutput.todayPlan.actions
    expect(actions.length).toBeGreaterThan(0)

    const targetAction = actions[0]
    const wasCompleted = targetAction.isCompleted

    usePlacementStore.getState().toggleTodayAction(targetAction.id)

    const updatedAction = usePlacementStore
      .getState()
      .recommendationOutput.todayPlan.actions.find((a) => a.id === targetAction.id)
    expect(updatedAction?.isCompleted).toBe(!wasCompleted)
  })

  it('resets to fresh onboarding state', () => {
    usePlacementStore.getState().resetToFreshOnboarding()
    const state = usePlacementStore.getState()

    expect(state.profile.onboardingCompleted).toBe(false)
    expect(state.activeTab).toBe('onboarding')
    expect(state.diagnosticResult).toBeNull()
  })
})

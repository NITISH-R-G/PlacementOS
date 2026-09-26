import { create } from 'zustand'
import {
  StudentProfile,
  SkillDimensionKey,
  DiagnosticResult,
  RecommendationEngineOutput,
  TargetRole,
} from '../types'
import { generatePersonalizedPlan } from '../lib/recommendationEngine'
import { INITIAL_RESOURCES } from '../data/resources'

const LOCAL_STORAGE_KEY = 'placement_os_state_v1'

const DEFAULT_PROFILE: StudentProfile = {
  id: 'usr-student-01',
  name: 'Arjun Sharma',
  college: 'Chennai Institute of Technology',
  degree: 'B.E. Computer Science & Engineering',
  currentYear: '3rd Year (6th Sem)',
  targetGraduationYear: 2026,
  targetRole: 'software_engineer',
  currentSkillLevel: 'intermediate',
  availableHoursPerDay: 2.5,
  placementDate: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000).toISOString(),
  daysUntilPlacement: 73,
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const DEFAULT_DIMENSION_SCORES: Partial<Record<SkillDimensionKey, number>> = {
  dsa: 42,
  cs_fundamentals: 58,
  programming: 65,
  sql: 50,
  development: 60,
  projects: 48,
  resume: 55,
  aptitude: 62,
  communication: 50,
  interview: 40,
}

interface PlacementState {
  profile: StudentProfile
  dimensionScores: Partial<Record<SkillDimensionKey, number>>
  completedResourceIds: string[]
  diagnosticResult: DiagnosticResult | null
  recommendationOutput: RecommendationEngineOutput
  streakDays: number
  totalHoursStudied: number
  activeTab: string // current navigation tab

  // Actions
  setActiveTab: (tab: string) => void
  updateProfile: (partial: Partial<StudentProfile>) => void
  completeOnboarding: (newProfile: StudentProfile, diagResult?: DiagnosticResult) => void
  toggleResourceCompletion: (resourceId: string) => void
  toggleTodayAction: (actionId: string) => void
  recomputeRecommendations: () => void
  resetToFreshOnboarding: () => void
  loadDemoProfile: () => void
}

function computeOutput(
  profile: StudentProfile,
  scores: Partial<Record<SkillDimensionKey, number>>,
  completedIds: string[],
  diagResult: DiagnosticResult | null
): RecommendationEngineOutput {
  return generatePersonalizedPlan(
    {
      targetRole: profile.targetRole,
      currentSkillLevel: profile.currentSkillLevel,
      dimensionScores: scores,
      availableDailyHours: profile.availableHoursPerDay,
      daysUntilPlacement: profile.daysUntilPlacement,
      completedResourceIds: completedIds,
      diagnosticResult: diagResult || undefined,
    },
    INITIAL_RESOURCES
  )
}

function loadInitialState(): {
  profile: StudentProfile
  scores: Partial<Record<SkillDimensionKey, number>>
  completedIds: string[]
  diagResult: DiagnosticResult | null
  streak: number
  hours: number
} {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        profile: parsed.profile || DEFAULT_PROFILE,
        scores: parsed.dimensionScores || DEFAULT_DIMENSION_SCORES,
        completedIds: parsed.completedResourceIds || ['res-dsa-01', 'res-cs-01'],
        diagResult: parsed.diagnosticResult || null,
        streak: parsed.streakDays ?? 5,
        hours: parsed.totalHoursStudied ?? 18.5,
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage', err)
  }

  return {
    profile: DEFAULT_PROFILE,
    scores: DEFAULT_DIMENSION_SCORES,
    completedIds: ['res-dsa-01', 'res-cs-01'],
    diagResult: null,
    streak: 5,
    hours: 18.5,
  }
}

const initial = loadInitialState()
const initialRecs = computeOutput(initial.profile, initial.scores, initial.completedIds, initial.diagResult)

export const usePlacementStore = create<PlacementState>((set, get) => ({
  profile: initial.profile,
  dimensionScores: initial.scores,
  completedResourceIds: initial.completedIds,
  diagnosticResult: initial.diagResult,
  recommendationOutput: initialRecs,
  streakDays: initial.streak,
  totalHoursStudied: initial.hours,
  activeTab: 'landing',

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  updateProfile: (partial) => {
    const newProfile = { ...get().profile, ...partial, updatedAt: new Date().toISOString() }
    const recs = computeOutput(
      newProfile,
      get().dimensionScores,
      get().completedResourceIds,
      get().diagnosticResult
    )
    set({ profile: newProfile, recommendationOutput: recs })
    saveToStorage(get())
  },

  completeOnboarding: (newProfile, diagResult) => {
    let updatedScores = { ...get().dimensionScores }
    if (diagResult?.scoreByDimension) {
      updatedScores = { ...updatedScores, ...diagResult.scoreByDimension }
    }
    const recs = computeOutput(
      newProfile,
      updatedScores,
      get().completedResourceIds,
      diagResult || null
    )
    set({
      profile: { ...newProfile, onboardingCompleted: true },
      dimensionScores: updatedScores,
      diagnosticResult: diagResult || null,
      recommendationOutput: recs,
      activeTab: 'dashboard',
    })
    saveToStorage(get())
  },

  toggleResourceCompletion: (resourceId: string) => {
    const currentCompleted = get().completedResourceIds
    const isCompleted = currentCompleted.includes(resourceId)
    const newCompleted = isCompleted
      ? currentCompleted.filter((id) => id !== resourceId)
      : [...currentCompleted, resourceId]

    const recs = computeOutput(
      get().profile,
      get().dimensionScores,
      newCompleted,
      get().diagnosticResult
    )

    const hoursAdded = isCompleted ? -0.5 : 0.75

    set((state) => ({
      completedResourceIds: newCompleted,
      recommendationOutput: recs,
      totalHoursStudied: Math.max(0, Number((state.totalHoursStudied + hoursAdded).toFixed(1))),
    }))
    saveToStorage(get())
  },

  toggleTodayAction: (actionId: string) => {
    const state = get()
    const currentActions = state.recommendationOutput.todayPlan.actions
    const action = currentActions.find((a) => a.id === actionId)
    if (!action) return

    const newActions = currentActions.map((a) =>
      a.id === actionId ? { ...a, isCompleted: !a.isCompleted } : a
    )

    const updatedTodayPlan = {
      ...state.recommendationOutput.todayPlan,
      actions: newActions,
      completedActionIds: newActions.filter((a) => a.isCompleted).map((a) => a.id),
    }

    // If linked to a resource, toggle resource as well
    let newCompletedResources = state.completedResourceIds
    if (action.resourceId && !action.isCompleted && !newCompletedResources.includes(action.resourceId)) {
      newCompletedResources = [...newCompletedResources, action.resourceId]
    }

    const updatedOutput = {
      ...state.recommendationOutput,
      todayPlan: updatedTodayPlan,
    }

    set({
      recommendationOutput: updatedOutput,
      completedResourceIds: newCompletedResources,
    })
    saveToStorage(get())
  },

  recomputeRecommendations: () => {
    const recs = computeOutput(
      get().profile,
      get().dimensionScores,
      get().completedResourceIds,
      get().diagnosticResult
    )
    set({ recommendationOutput: recs })
    saveToStorage(get())
  },

  resetToFreshOnboarding: () => {
    const freshProfile: StudentProfile = {
      id: `usr-${Date.now()}`,
      name: '',
      college: '',
      degree: '',
      currentYear: '3rd Year',
      targetGraduationYear: 2026,
      targetRole: 'software_engineer',
      currentSkillLevel: 'beginner',
      availableHoursPerDay: 2,
      placementDate: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000).toISOString(),
      daysUntilPlacement: 73,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const freshScores: Partial<Record<SkillDimensionKey, number>> = {
      dsa: 30,
      cs_fundamentals: 30,
      programming: 35,
      sql: 30,
      development: 30,
      projects: 25,
      resume: 30,
      aptitude: 40,
      communication: 40,
      interview: 25,
    }
    const recs = computeOutput(freshProfile, freshScores, [], null)
    set({
      profile: freshProfile,
      dimensionScores: freshScores,
      completedResourceIds: [],
      diagnosticResult: null,
      recommendationOutput: recs,
      activeTab: 'onboarding',
    })
    saveToStorage(get())
  },

  loadDemoProfile: () => {
    const recs = computeOutput(DEFAULT_PROFILE, DEFAULT_DIMENSION_SCORES, ['res-dsa-01', 'res-cs-01'], null)
    set({
      profile: DEFAULT_PROFILE,
      dimensionScores: DEFAULT_DIMENSION_SCORES,
      completedResourceIds: ['res-dsa-01', 'res-cs-01'],
      diagnosticResult: null,
      recommendationOutput: recs,
      streakDays: 5,
      totalHoursStudied: 18.5,
      activeTab: 'dashboard',
    })
    saveToStorage(get())
  },
}))

function saveToStorage(state: PlacementState) {
  try {
    const payload = {
      profile: state.profile,
      dimensionScores: state.dimensionScores,
      completedResourceIds: state.completedResourceIds,
      diagnosticResult: state.diagnosticResult,
      streakDays: state.streakDays,
      totalHoursStudied: state.totalHoursStudied,
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  } catch (err) {
    console.warn('Failed to save to localStorage', err)
  }
}

import {
  RecommendationEngineInput,
  RecommendationEngineOutput,
  ReadinessProfile,
  SkillDimensionKey,
  TargetRole,
  RecommendedAction,
  TodayPlan,
  RoadmapMilestone,
  SkillGapWarning,
  LearningResource,
} from '../types'
import { INITIAL_RESOURCES } from '../data/resources'

/**
 * Role Importance Weight Matrix (Normalized to 1.0)
 * Allows deterministic prioritization based on industry placement expectations.
 */
export const ROLE_WEIGHTS: Record<TargetRole, Record<SkillDimensionKey, number>> = {
  software_engineer: {
    dsa: 0.30,
    cs_fundamentals: 0.20,
    programming: 0.15,
    development: 0.10,
    projects: 0.10,
    sql: 0.05,
    interview: 0.05,
    communication: 0.03,
    resume: 0.01,
    aptitude: 0.01,
  },
  frontend_developer: {
    development: 0.30,
    projects: 0.20,
    programming: 0.18,
    dsa: 0.12,
    interview: 0.08,
    communication: 0.05,
    resume: 0.03,
    sql: 0.02,
    cs_fundamentals: 0.01,
    aptitude: 0.01,
  },
  backend_developer: {
    development: 0.25,
    sql: 0.20,
    cs_fundamentals: 0.20,
    dsa: 0.15,
    programming: 0.10,
    projects: 0.04,
    interview: 0.03,
    communication: 0.01,
    resume: 0.01,
    aptitude: 0.01,
  },
  data_analyst: {
    sql: 0.35,
    aptitude: 0.20,
    projects: 0.15,
    programming: 0.10,
    communication: 0.10,
    interview: 0.05,
    resume: 0.03,
    development: 0.01,
    cs_fundamentals: 0.005,
    dsa: 0.005,
  },
  data_scientist: {
    programming: 0.25,
    sql: 0.20,
    projects: 0.20,
    aptitude: 0.15,
    cs_fundamentals: 0.10,
    communication: 0.05,
    interview: 0.03,
    dsa: 0.01,
    resume: 0.005,
    development: 0.005,
  },
  aiml_engineer: {
    programming: 0.25,
    cs_fundamentals: 0.20,
    dsa: 0.20,
    projects: 0.20,
    aptitude: 0.05,
    sql: 0.05,
    interview: 0.03,
    communication: 0.01,
    resume: 0.005,
    development: 0.005,
  },
  product_tech: {
    communication: 0.25,
    interview: 0.25,
    aptitude: 0.15,
    projects: 0.15,
    resume: 0.10,
    cs_fundamentals: 0.05,
    sql: 0.02,
    development: 0.01,
    programming: 0.01,
    dsa: 0.01,
  },
}

const DIMENSION_METADATA: Record<SkillDimensionKey, { label: string; defaultWeak: string; strength: string }> = {
  dsa: { label: 'DSA & Algorithms', defaultWeak: 'Sliding Window & Dynamic Programming', strength: 'Array & Hash basics' },
  cs_fundamentals: { label: 'CS Fundamentals', defaultWeak: 'OS Concurrency & Mutexes', strength: 'Process vs Thread concepts' },
  programming: { label: 'Programming & OOP', defaultWeak: 'SOLID Principles & Refactoring', strength: 'Basic language syntax' },
  sql: { label: 'SQL & Database Design', defaultWeak: 'Window Functions & CTEs', strength: 'Basic Joins & Filtering' },
  development: { label: 'Full-Stack Development', defaultWeak: 'API Idempotency & Rate Limiting', strength: 'CRUD Endpoints' },
  projects: { label: 'Portfolio Projects', defaultWeak: 'Production Architecture & Tradeoffs', strength: 'Working Prototype' },
  resume: { label: 'Resume & ATS Readiness', defaultWeak: 'Quantified Impact Metrics (XYZ)', strength: 'Standard Layout' },
  aptitude: { label: 'OA Aptitude & Speed', defaultWeak: 'Permutations & Probability Drills', strength: 'Basic Arithmetic' },
  communication: { label: 'Engineering Communication', defaultWeak: 'STAR Behavioral Framework', strength: 'Technical fluency' },
  interview: { label: 'Live Interview Technique', defaultWeak: 'Live Problem Dissection & Clarification', strength: 'Code translation' },
}

/**
 * Deterministic Personalization Engine
 * Synthesizes student inputs, role weights, diagnostic results, and resource completion.
 */
export function generatePersonalizedPlan(
  input: RecommendationEngineInput,
  catalog: LearningResource[] = INITIAL_RESOURCES
): RecommendationEngineOutput {
  const roleWeights = ROLE_WEIGHTS[input.targetRole] || ROLE_WEIGHTS.software_engineer
  const allDimensions: SkillDimensionKey[] = [
    'dsa',
    'programming',
    'cs_fundamentals',
    'sql',
    'development',
    'projects',
    'resume',
    'aptitude',
    'communication',
    'interview',
  ]

  // Compute baseline scores
  const profileScores: Record<SkillDimensionKey, number> = {} as any
  let totalWeightedScore = 0

  allDimensions.forEach((dim) => {
    let score = input.dimensionScores[dim] ?? 45 // fallback baseline
    if (input.diagnosticResult?.scoreByDimension[dim] !== undefined) {
      // Diagnostic assessment shifts score
      score = Math.round((score + (input.diagnosticResult.scoreByDimension[dim] || 50)) / 2)
    }
    // Completed resources boost score
    const completedInDim = catalog.filter(
      (r) => r.category === dim && input.completedResourceIds.includes(r.id)
    ).length
    score = Math.min(100, score + completedInDim * 12)

    profileScores[dim] = score
    totalWeightedScore += score * (roleWeights[dim] || 0.1)
  })

  const overallScore = Math.min(100, Math.max(10, Math.round(totalWeightedScore)))

  // Identify prioritized dimensions sorted by deficit * role weight
  const dimensionDeficits = allDimensions.map((dim) => {
    const score = profileScores[dim]
    const weight = roleWeights[dim] || 0.05
    // Deficit weighted by role priority
    const urgency = (100 - score) * weight
    return { dimension: dim, score, weight, urgency }
  })
  dimensionDeficits.sort((a, b) => b.urgency - a.urgency)

  // Construct Readiness Profile
  const readinessProfile: ReadinessProfile = {} as any
  allDimensions.forEach((dim) => {
    const score = profileScores[dim]
    const meta = DIMENSION_METADATA[dim]
    const dimResources = catalog.filter((r) => r.category === dim)
    const completedCount = dimResources.filter((r) => input.completedResourceIds.includes(r.id)).length

    readinessProfile[dim] = {
      dimension: dim,
      label: meta.label,
      score,
      confidence: score > 75 ? 'high' : score > 45 ? 'medium' : 'low',
      completedItemsCount: completedCount,
      totalItemsCount: Math.max(dimResources.length, 3),
      weakAreas: [meta.defaultWeak],
      strengths: [meta.strength],
      recommendedNextActions: [],
    }
  })

  // Identify Top 3 Skill Gaps
  const topGaps = dimensionDeficits.slice(0, 3)
  const skillGaps: SkillGapWarning[] = topGaps.map((item) => {
    const meta = DIMENSION_METADATA[item.dimension]
    const matchingResource = catalog.find(
      (r) => r.category === item.dimension && !input.completedResourceIds.includes(r.id)
    )

    return {
      dimension: item.dimension,
      title: `${meta.label}: ${meta.defaultWeak}`,
      impact: `High weight (${Math.round(item.weight * 100)}%) for ${input.targetRole.replace('_', ' ')} roles. Current readiness is ${item.score}%.`,
      severity: item.urgency > 15 ? 'urgent' : item.urgency > 8 ? 'moderate' : 'minor',
      actionToFix: `Complete recommended drill: ${matchingResource?.title || meta.defaultWeak}`,
      suggestedResourceId: matchingResource?.id,
    }
  })

  // Recommended Resources (Uncompleted ones in top deficit categories first)
  const prioritizedCategories = dimensionDeficits.map((d) => d.dimension)
  const recommendedResources = [...catalog]
    .filter((r) => !input.completedResourceIds.includes(r.id))
    .sort((a, b) => {
      const idxA = prioritizedCategories.indexOf(a.category)
      const idxB = prioritizedCategories.indexOf(b.category)
      return idxA - idxB
    })
    .slice(0, 6)

  // Build "Today" Plan fitting student's available daily hours
  const availableMinutes = (input.availableDailyHours || 2) * 60
  let allocatedMinutes = 0
  const todayActions: RecommendedAction[] = []

  for (const resource of recommendedResources) {
    if (allocatedMinutes + resource.estimatedMinutes <= availableMinutes + 15) {
      todayActions.push({
        id: `act-${resource.id}`,
        title: resource.title,
        rationale: `Directly bridges your highest deficit in ${DIMENSION_METADATA[resource.category].label}.`,
        dimension: resource.category,
        priority: todayActions.length === 0 ? 'critical' : 'high',
        estimatedMinutes: resource.estimatedMinutes,
        resourceId: resource.id,
        resource,
        isCompleted: false,
      })
      allocatedMinutes += resource.estimatedMinutes
    }
    if (todayActions.length >= 3) break
  }

  // Fallback action if list was empty
  if (todayActions.length === 0 && recommendedResources.length > 0) {
    const res = recommendedResources[0]
    todayActions.push({
      id: `act-${res.id}`,
      title: res.title,
      rationale: 'Primary target topic for today.',
      dimension: res.category,
      priority: 'high',
      estimatedMinutes: res.estimatedMinutes,
      resourceId: res.id,
      resource: res,
      isCompleted: false,
    })
    allocatedMinutes = res.estimatedMinutes
  }

  const todayPlan: TodayPlan = {
    date: new Date().toISOString().split('T')[0],
    totalEstimatedMinutes: allocatedMinutes,
    availableMinutes,
    priorityFocus: `${DIMENSION_METADATA[dimensionDeficits[0].dimension].label} Deficit Bridge`,
    actions: todayActions,
    completedActionIds: [],
  }

  // Populate recommendedNextActions into readiness profile
  todayActions.forEach((act) => {
    if (readinessProfile[act.dimension]) {
      readinessProfile[act.dimension].recommendedNextActions.push(act)
    }
  })

  // Multi-Phase Adaptive Roadmap
  const daysLeft = Math.max(14, input.daysUntilPlacement || 73)
  const phase1Days = Math.round(daysLeft * 0.25)
  const phase2Days = Math.round(daysLeft * 0.35)
  const phase3Days = Math.round(daysLeft * 0.20)
  const phase4Days = daysLeft - (phase1Days + phase2Days + phase3Days)

  const roadmap: RoadmapMilestone[] = [
    {
      id: 'phase-1',
      phaseNumber: 1,
      phaseTitle: 'Foundational Diagnostics & Skill Deficit Bridges',
      daysWindow: `Days 1 - ${phase1Days}`,
      isCurrent: true,
      isCompleted: false,
      description: 'Plug critical knowledge gaps in priority dimensions and cement daily study velocity.',
      focusAreas: [dimensionDeficits[0].dimension, dimensionDeficits[1].dimension],
      tasks: [
        {
          id: 'p1-t1',
          title: `Solve 10 high-frequency ${DIMENSION_METADATA[dimensionDeficits[0].dimension].label} patterns`,
          category: dimensionDeficits[0].dimension,
          estimatedHours: 6,
          completed: false,
        },
        {
          id: 'p1-t2',
          title: `Review core ${DIMENSION_METADATA[dimensionDeficits[1].dimension].label} concepts`,
          category: dimensionDeficits[1].dimension,
          estimatedHours: 4,
          completed: false,
        },
        {
          id: 'p1-t3',
          title: 'Format technical resume to ATS single-page standard',
          category: 'resume',
          estimatedHours: 2,
          completed: false,
        },
      ],
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      phaseTitle: 'Core Problem Solving & Speed Drills',
      daysWindow: `Days ${phase1Days + 1} - ${phase1Days + phase2Days}`,
      isCurrent: false,
      isCompleted: false,
      description: 'Intense time-bound problem solving, SQL window queries, and OS deadlock drills.',
      focusAreas: ['dsa', 'cs_fundamentals', 'sql'],
      tasks: [
        {
          id: 'p2-t1',
          title: 'Complete 25 Striver A2Z medium difficulty problems under 30min each',
          category: 'dsa',
          estimatedHours: 15,
          completed: false,
        },
        {
          id: 'p2-t2',
          title: 'Master OS Concurrency & DBMS BCNF Normalization',
          category: 'cs_fundamentals',
          estimatedHours: 8,
          completed: false,
        },
      ],
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      phaseTitle: 'Project Deep-Dive & System Tradeoffs',
      daysWindow: `Days ${phase1Days + phase2Days + 1} - ${phase1Days + phase2Days + phase3Days}`,
      isCurrent: false,
      isCompleted: false,
      description: 'Prepare in-depth defense for 2 major resume projects and architecture decisions.',
      focusAreas: ['projects', 'development'],
      tasks: [
        {
          id: 'p3-t1',
          title: 'Document architecture, bottleneck, and latency tradeoffs for Project 1',
          category: 'projects',
          estimatedHours: 5,
          completed: false,
        },
      ],
    },
    {
      id: 'phase-4',
      phaseNumber: 4,
      phaseTitle: 'Mock Sprints & Behavioral Execution',
      daysWindow: `Days ${daysLeft - phase4Days + 1} - ${daysLeft}`,
      isCurrent: false,
      isCompleted: false,
      description: 'Full-dress online assessments (OA) simulations, STAR behavioral rehearsals, and interview composure.',
      focusAreas: ['interview', 'communication', 'aptitude'],
      tasks: [
        {
          id: 'p4-t1',
          title: 'Complete 3 timed OA simulations (Aptitude + 2 DSA questions in 90 mins)',
          category: 'aptitude',
          estimatedHours: 6,
          completed: false,
        },
        {
          id: 'p4-t2',
          title: 'Rehearse 10 STAR behavioral stories out loud with timer',
          category: 'communication',
          estimatedHours: 3,
          completed: false,
        },
      ],
    },
  ]

  const topWeakness = DIMENSION_METADATA[dimensionDeficits[0].dimension].label
  const whatMattersNow = `You have ${daysLeft} days until placement season. Your biggest score leverage right now is ${topWeakness} (${dimensionDeficits[0].score}% readiness), which accounts for ${Math.round(dimensionDeficits[0].weight * 100)}% of your target role evaluation.`

  return {
    overallScore,
    readinessProfile,
    todayPlan,
    skillGaps,
    roadmap,
    recommendedResources,
    whatMattersNow,
  }
}

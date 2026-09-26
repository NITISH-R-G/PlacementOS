export type TargetRole =
  | 'software_engineer'
  | 'frontend_developer'
  | 'backend_developer'
  | 'data_analyst'
  | 'data_scientist'
  | 'aiml_engineer'
  | 'product_tech'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type ConfidenceLevel = 'low' | 'medium' | 'high'

export type ActionPriority = 'critical' | 'high' | 'medium' | 'low'

export type SkillDimensionKey =
  | 'dsa'
  | 'programming'
  | 'cs_fundamentals'
  | 'sql'
  | 'development'
  | 'projects'
  | 'resume'
  | 'aptitude'
  | 'communication'
  | 'interview'

export interface StudentProfile {
  id: string
  name: string
  college: string
  degree: string
  currentYear: string
  targetGraduationYear: number
  targetRole: TargetRole
  currentSkillLevel: SkillLevel
  availableHoursPerDay: number
  placementDate: string // ISO string or date
  daysUntilPlacement: number
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface DimensionReadiness {
  dimension: SkillDimensionKey
  label: string
  score: number // 0 to 100
  confidence: ConfidenceLevel
  completedItemsCount: number
  totalItemsCount: number
  weakAreas: string[]
  strengths: string[]
  recommendedNextActions: RecommendedAction[]
}

export type ReadinessProfile = Record<SkillDimensionKey, DimensionReadiness>

export interface OverallReadiness {
  score: number // 0 to 100 weighted aggregate
  trend: 'improving' | 'steady' | 'declining'
  percentile: number // e.g. top 15%
  whatMattersNow: string
  targetRoleAlignment: number
  weeklyConsistencyStreak: number // days
  hoursInvestedTotal: number
  topicsCompletedCount: number
}

export type ResourceCategory = SkillDimensionKey

export type ResourceType =
  | 'article'
  | 'video'
  | 'interactive'
  | 'problem'
  | 'cheatsheet'
  | 'project_guide'

export type ResourceSource =
  | 'freeCodeCamp'
  | 'OSSU'
  | 'Striver A2Z'
  | 'Curated Placement'
  | 'System Design Primer'
  | 'NeetCode/DSA'

export interface LearningResource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  subcategory: string
  difficulty: SkillLevel
  source: ResourceSource
  sourceUrl: string
  estimatedMinutes: number
  prerequisites: string[]
  skills: string[]
  tags: string[]
  type: ResourceType
  order: number
  isCompleted?: boolean
  completedAt?: string
}

export interface RecommendedAction {
  id: string
  title: string
  rationale: string
  dimension: SkillDimensionKey
  priority: ActionPriority
  estimatedMinutes: number
  resourceId?: string
  resource?: LearningResource
  isCompleted?: boolean
}

export interface TodayPlan {
  date: string
  totalEstimatedMinutes: number
  availableMinutes: number
  priorityFocus: string
  actions: RecommendedAction[]
  completedActionIds: string[]
}

export interface RoadmapMilestone {
  id: string
  phaseNumber: number
  phaseTitle: string
  daysWindow: string
  isCurrent: boolean
  isCompleted: boolean
  description: string
  focusAreas: SkillDimensionKey[]
  tasks: {
    id: string
    title: string
    category: SkillDimensionKey
    estimatedHours: number
    completed: boolean
    resourceRef?: string
  }[]
}

export interface SkillGapWarning {
  dimension: SkillDimensionKey
  title: string
  impact: string
  severity: 'urgent' | 'moderate' | 'minor'
  actionToFix: string
  suggestedResourceId?: string
}

export interface DiagnosticQuestion {
  id: string
  dimension: SkillDimensionKey
  prompt: string
  codeSnippet?: string
  options: {
    id: string
    text: string
  }[]
  correctOptionId: string
  explanation: string
  difficulty: SkillLevel
}

export interface DiagnosticResult {
  scoreByDimension: Partial<Record<SkillDimensionKey, number>>
  completedAt: string
  totalQuestions: number
  correctCount: number
  detectedGaps: string[]
}

export interface RecommendationEngineInput {
  targetRole: TargetRole
  currentSkillLevel: SkillLevel
  dimensionScores: Partial<Record<SkillDimensionKey, number>>
  availableDailyHours: number
  daysUntilPlacement: number
  completedResourceIds: string[]
  diagnosticResult?: DiagnosticResult
}

export interface RecommendationEngineOutput {
  overallScore: number
  readinessProfile: ReadinessProfile
  todayPlan: TodayPlan
  skillGaps: SkillGapWarning[]
  roadmap: RoadmapMilestone[]
  recommendedResources: LearningResource[]
  whatMattersNow: string
}

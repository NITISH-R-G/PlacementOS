import { usePlacementStore } from '@/store/usePlacementStore'

export function useReadiness() {
  const { profile, recommendationOutput, streakDays, totalHoursStudied } = usePlacementStore()

  return {
    profile,
    overallScore: recommendationOutput.overallScore,
    readinessProfile: recommendationOutput.readinessProfile,
    todayPlan: recommendationOutput.todayPlan,
    skillGaps: recommendationOutput.skillGaps,
    roadmap: recommendationOutput.roadmap,
    whatMattersNow: recommendationOutput.whatMattersNow,
    streakDays,
    totalHoursStudied,
  }
}

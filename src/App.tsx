import React from 'react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { AppShell } from '@/layouts/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow'
import { RoadmapView } from '@/features/roadmap/RoadmapView'
import { PracticeView } from '@/features/practice/PracticeView'
import { AssessmentView } from '@/features/assessment/AssessmentView'
import { InterviewView } from '@/features/interviews/InterviewView'
import { ResourcesView } from '@/features/resources/ResourcesView'
import { AnalyticsView } from '@/features/analytics/AnalyticsView'

export function App() {
  const { activeTab } = usePlacementStore()

  // Landing page renders as the exact single-viewport layout specified
  if (activeTab === 'landing') {
    return <LandingPage />
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'onboarding':
        return <OnboardingFlow />
      case 'dashboard':
        return <DashboardView />
      case 'roadmap':
        return <RoadmapView />
      case 'practice':
        return <PracticeView />
      case 'assessment':
        return <AssessmentView />
      case 'interview':
        return <InterviewView />
      case 'resources':
        return <ResourcesView />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <DashboardView />
    }
  }

  return <AppShell>{renderActiveView()}</AppShell>
}

export default App

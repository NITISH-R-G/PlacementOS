import React, { useEffect } from 'react'
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

const VALID_TABS = [
  'landing',
  'onboarding',
  'dashboard',
  'roadmap',
  'practice',
  'assessment',
  'interview',
  'interviews',
  'resources',
  'analytics',
]

export function App() {
  const { activeTab, setActiveTab } = usePlacementStore()

  // Hash-based routing to support browser back/forward and direct deep-linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase()
      if (hash && VALID_TABS.includes(hash)) {
        setActiveTab(hash === 'interviews' ? 'interview' : hash)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [setActiveTab])

  // Sync activeTab changes to window location hash
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '').toLowerCase()
    const targetHash = activeTab === 'landing' ? '' : activeTab
    if (currentHash !== targetHash) {
      if (targetHash) {
        window.history.replaceState(null, '', '#' + targetHash)
      } else if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [activeTab])

  // Landing page renders as the single-viewport hero layout
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
      case 'interviews':
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

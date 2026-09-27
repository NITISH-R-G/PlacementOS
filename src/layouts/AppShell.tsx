import React from 'react'
import {
  Sparkles,
  LayoutDashboard,
  Map,
  Code2,
  Library,
  FileCheck2,
  BarChart3,
  MessageSquareCode,
  Flame,
  Clock,
  RotateCcw,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    profile,
    streakDays,
    resetToFreshOnboarding,
    loadDemoProfile,
  } = usePlacementStore()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'practice', label: 'Practice Lab', icon: Code2 },
    { id: 'assessment', label: 'Diagnostic', icon: FileCheck2 },
    { id: 'interviews', label: 'Mock Interview', icon: MessageSquareCode },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'analytics', label: 'Readiness Analytics', icon: BarChart3 },
  ]

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100">
      {/* Top Banner: Minimalist high-contrast announcement */}
      <div className="border-b border-white/[0.08] bg-zinc-950/80 px-4 py-1.5 text-xs text-zinc-300 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide text-white font-mono text-[11px]">AI PLACEMENT OS:</span>
          <span className="hidden sm:inline text-zinc-400">
            Deterministic Engine active. Continuous roadmap optimization enabled.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset state to take the full onboarding diagnostic flow?')) {
                resetToFreshOnboarding()
              }
            }}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Start from scratch with onboarding diagnostic"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Onboarding
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={loadDemoProfile}
            className="text-xs text-zinc-300 hover:text-white font-medium transition-colors"
          >
            Load Demo Profile
          </button>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('landing')}
                className="flex items-center gap-2.5 group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                      PlacementOS
                    </span>
                    <Badge variant="cyan" className="px-1.5 py-0 text-[10px] font-mono">
                      v1.0
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 hidden sm:block">
                    Reimagined Campus Placement Prep
                  </p>
                </div>
              </button>

              {/* Navigation Items (Desktop) - High-contrast pill navigation container */}
              <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-1 pl-4 border-l border-white/[0.08]">
                <div className="bg-zinc-900/90 border border-white/[0.08] rounded-full p-1 flex items-center gap-1 shadow-inner">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </nav>
            </div>

            {/* Student Context & Metrics Pills */}
            <div className="flex items-center gap-3">
              {/* Placement Countdown Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.08] text-xs text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-300" />
                <span>
                  <strong className="text-white font-semibold">{profile.daysUntilPlacement}</strong> days left
                </span>
              </div>

              {/* Streak Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span className="font-semibold font-mono">{streakDays}d</span>
                <span className="hidden md:inline text-amber-400/80">streak</span>
              </div>

              {/* Profile Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/[0.15] flex items-center justify-center text-xs font-semibold text-zinc-200">
                  {profile.name ? profile.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs leading-tight">
                  <div className="text-zinc-200 font-medium truncate max-w-[120px]">
                    {profile.name || 'Student'}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-[120px]">
                    {formatRole(profile.targetRole)}
                  </div>
                </div>
              </div>

              {activeTab === 'landing' && (
                <Button
                  size="sm"
                  variant="glow"
                  onClick={() => setActiveTab('dashboard')}
                  className="hidden sm:inline-flex"
                >
                  Open Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Row */}
          <nav aria-label="Mobile Navigation" className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-white/[0.06] scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-black font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer with Attribution & Hackathon Notes */}
      <footer className="border-t border-white/[0.08] bg-black/90 py-6 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">AI Placement OS</span>
            <span>—</span>
            <span>Deterministic Placement Preparation & Adaptive Readiness Engine</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Attribution: OSSU, freeCodeCamp, Striver A2Z</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('resources')}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              View Catalog
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

import React from 'react'
import {
  LayoutDashboard,
  Map,
  Code2,
  Library,
  BarChart3,
  FileCheck2,
  Clock,
  Sparkles,
  Flame,
  RotateCcw,
  MessageSquareCode,
  Home,
  ChevronDown,
  User,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    profile,
    activeTab,
    setActiveTab,
    streakDays,
    loadDemoProfile,
    resetToFreshOnboarding,
  } = usePlacementStore()

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'practice', label: 'Practice Lab', icon: Code2 },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquareCode },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'analytics', label: 'Readiness Analytics', icon: BarChart3 },
    { id: 'assessment', label: 'Diagnostic', icon: FileCheck2 },
  ]

  const formatRole = (role: string) => {
    return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Skip to Content Link (Accessibility / Jakob's Law convention) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-white focus:text-black focus:font-semibold focus:text-xs focus:rounded-md focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Top System Status Bar */}
      <div className="border-b border-border/40 bg-zinc-950/90 text-xs text-zinc-300 py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded px-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Flow</span>
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={() => loadDemoProfile()}
            className="text-xs text-zinc-300 hover:text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded px-1"
          >
            Load Demo Profile
          </button>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-black/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('landing')}
                className="flex items-center gap-2.5 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg p-1"
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
              <nav aria-label="Main Navigation" className="hidden lg:flex items-center space-x-1 pl-4 border-l border-border/40">
                <div className="bg-zinc-900/90 border border-border/60 rounded-full p-1 flex items-center gap-1 shadow-inner">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id || (item.id === 'interview' && activeTab === 'interviews')
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-border/60 text-xs text-zinc-300" title="Days remaining until placement assessments">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  <strong className="text-white font-semibold">{profile.daysUntilPlacement}</strong> days left
                </span>
              </div>

              {/* Streak Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300" title="Consecutive daily study streak">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span className="font-semibold font-mono">{streakDays}d</span>
                <span className="hidden md:inline text-amber-400/80">streak</span>
              </div>

              {/* Profile Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-2 border-l border-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg p-1 transition-colors hover:bg-white/5">
                    <Avatar className="w-7 h-7 border border-white/20">
                      <AvatarFallback className="bg-zinc-800 text-zinc-200 text-xs font-semibold">
                        {profile.name ? profile.name.charAt(0) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left text-xs leading-tight">
                      <div className="text-zinc-200 font-medium truncate max-w-[120px]">
                        {profile.name || 'Student'}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-[120px]">
                        {formatRole(profile.targetRole)}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-zinc-500 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-border/80 text-zinc-200">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{profile.name || 'Candidate'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile.college || 'Engineering Institute'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem onClick={() => setActiveTab('dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('roadmap')} className="cursor-pointer">
                    <Map className="mr-2 h-4 w-4" />
                    <span>Personal Roadmap</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('analytics')} className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Readiness Analytics</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem onClick={() => loadDemoProfile()} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Reload Demo Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm('Reset state to take the full onboarding diagnostic flow?')) {
                        resetToFreshOnboarding()
                      }
                    }}
                    className="cursor-pointer text-rose-400 focus:text-rose-300"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    <span>Reset to Onboarding</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
          <nav aria-label="Mobile Navigation" className="lg:hidden flex items-center space-x-1.5 overflow-x-auto py-2.5 border-t border-border/40 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'interview' && activeTab === 'interviews')
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap px-3.5 py-1.5 min-h-[36px] rounded-full text-xs flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 border border-white/[0.04]'
                  }`}
                >
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        {children}
      </main>

      {/* Footer with Attribution & Hackathon Notes */}
      <footer className="border-t border-border/50 bg-black/90 py-6 text-xs text-zinc-400">
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
              className="hover:text-white transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
            >
              View Catalog
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

import React from 'react'
import {
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Target,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SkillDimensionKey } from '@/types'

export const DashboardView: React.FC = () => {
  const {
    profile,
    recommendationOutput,
    streakDays,
    totalHoursStudied,
    completedResourceIds,
    toggleTodayAction,
    toggleResourceCompletion,
    setActiveTab,
  } = usePlacementStore()

  const {
    overallScore,
    readinessProfile,
    todayPlan,
    skillGaps,
    roadmap,
    recommendedResources,
    whatMattersNow,
  } = recommendationOutput

  const formatRole = (role: string) => {
    return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Active roadmap phase
  const currentPhase = roadmap.find((p) => p.isCurrent) || roadmap[0]

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Greeting & Countdown Bar (Where am I? / Jakob's Law Dashboard convention) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Good morning, {profile.name ? profile.name.split(' ')[0] : 'Engineer'}
            </h1>
            <Badge variant="cyan" className="font-mono text-xs">
              {profile.currentYear}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Targeting <strong className="text-zinc-200">{formatRole(profile.targetRole)}</strong> at{' '}
            <span className="text-zinc-300">{profile.college}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-right shadow-sm">
            <div className="text-xs text-zinc-400 font-medium">Placement Countdown</div>
            <div className="text-lg font-bold font-mono text-white flex items-center gap-1.5 justify-end">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{profile.daysUntilPlacement} Days Left</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-right shadow-sm">
            <div className="text-xs text-amber-300 font-medium">Study Streak</div>
            <div className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1.5 justify-end">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero: Overall Placement Readiness & "What Matters Now" (What is my current status? What matters most?) */}
      <Card variant="action" className="border-white/[0.12] bg-gradient-to-br from-zinc-950 via-[#0a0a0f] to-black relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none -z-0" />
        <CardContent className="p-6 sm:p-8 space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-200 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Deterministic Readiness Assessment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Overall Placement Readiness Score
              </h2>
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.08] text-xs sm:text-sm text-zinc-300 leading-relaxed shadow-inner">
                <strong className="text-white font-semibold uppercase tracking-wider block text-[11px] mb-1">
                  What Matters Now:
                </strong>
                {whatMattersNow}
              </div>
            </div>

            {/* Circular / Radial Score Stat Box */}
            <div className="flex sm:flex-col items-center justify-center p-6 rounded-2xl bg-black/90 border border-white/[0.12] min-w-[200px] text-center shadow-2xl">
              <div className="text-5xl font-black font-mono tracking-tight text-white mb-1">
                {overallScore}%
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4% this week</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-2 uppercase tracking-wider font-medium">
                Readiness Index
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.08] text-xs">
            <div>
              <span className="text-zinc-400 block mb-0.5">Hours Studied</span>
              <span className="text-base font-bold font-mono text-white">{totalHoursStudied}h</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Completed Drills</span>
              <span className="text-base font-bold font-mono text-white">{completedResourceIds.length} topics</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Current Phase</span>
              <span className="text-base font-semibold text-white">Phase {currentPhase.phaseNumber}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Daily Budget</span>
              <span className="text-base font-bold font-mono text-white">{profile.availableHoursPerDay}h / day</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Two-Column Layout: "Today's Plan" (Left) & "Top Weakness Gaps" (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Recommended Plan (What should I do next? - 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-white/[0.08] bg-[#0c0d12]/90">
            <CardHeader className="pb-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">Today's Recommended Plan</CardTitle>
                    <CardDescription className="text-xs">
                      Engine allocated {todayPlan.totalEstimatedMinutes} mins of your {todayPlan.availableMinutes} min budget.
                    </CardDescription>
                  </div>
                </div>

                <Badge variant="secondary" className="font-mono text-[11px] bg-zinc-900 border-white/[0.08] text-zinc-300">
                  {todayPlan.actions.filter((a) => todayPlan.completedActionIds?.includes(a.id) || a.isCompleted).length} / {todayPlan.actions.length} Done
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {todayPlan.actions.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  No active actions for today. Run your diagnostic assessment to generate calibrated drills.
                </div>
              ) : (
                todayPlan.actions.map((action) => {
                  const isDone = todayPlan.completedActionIds?.includes(action.id) || !!action.isCompleted
                  return (
                    <div
                      key={action.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'border-emerald-500/20 bg-emerald-950/10'
                          : 'border-white/[0.08] bg-zinc-900/40 hover:border-white/[0.14]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTodayAction(action.id)}
                            className="mt-0.5 text-zinc-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
                            title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                            )}
                          </button>
                          <div className="space-y-1">
                            <span
                              className={`text-xs font-semibold block leading-tight ${
                                isDone ? 'line-through text-zinc-400' : 'text-zinc-100'
                              }`}
                            >
                              {action.title}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                              <span className="font-mono">{action.estimatedMinutes} mins</span>
                              <span>•</span>
                              <span className="capitalize">{action.dimension ? action.dimension.replace('_', ' ') : 'Practice'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={isDone ? 'outline' : 'default'}
                            onClick={() => {
                              toggleTodayAction(action.id)
                              if (!isDone) setActiveTab('practice')
                            }}
                            className="text-xs h-8 rounded-full px-3.5"
                          >
                            {isDone ? 'Completed' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Current Roadmap Milestone Snapshot */}
          <Card className="border-white/[0.08] bg-[#0c0d12]/90">
            <CardHeader className="pb-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white">Active Roadmap Phase</CardTitle>
                  <CardDescription className="text-xs">
                    Phase {currentPhase.phaseNumber}: {currentPhase.phaseTitle} ({currentPhase.daysWindow})
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveTab('roadmap')}
                  className="text-xs text-white hover:text-zinc-300 flex items-center gap-1"
                >
                  <span>View Full Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                {currentPhase.description}
              </p>
              <div className="space-y-2 pt-1">
                {currentPhase.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06] text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="text-zinc-200">{task.title}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      ~{task.estimatedHours}h
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Skill Gaps & Readiness Matrix (What requires attention? - 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top 3 Skill Gaps */}
          <Card className="border-white/[0.08] bg-[#0c0d12]/90">
            <CardHeader className="pb-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">Top 3 Skill Gaps</CardTitle>
                    <CardDescription className="text-xs">
                      Highest urgency deficits impacting your role placement.
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-200">{gap.title}</span>
                    <Badge variant="destructive" className="text-[10px] uppercase font-mono">
                      {gap.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{gap.impact}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-300 font-medium truncate max-w-[200px]">
                      {gap.actionToFix}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (gap.suggestedResourceId) {
                          toggleResourceCompletion(gap.suggestedResourceId)
                        } else {
                          setActiveTab('practice')
                        }
                      }}
                      className="text-[11px] h-7 px-2.5 rounded-full"
                    >
                      Address Gap →
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 10-Dimension Readiness Matrix Progress Bars */}
          <Card className="border-white/[0.08] bg-[#0c0d12]/90">
            <CardHeader className="pb-3 border-b border-white/[0.06]">
              <CardTitle className="text-base text-white">Dimensional Competency Matrix</CardTitle>
              <CardDescription className="text-xs">
                Empirical readiness calculated across 10 engineering pillars.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {(Object.keys(readinessProfile) as SkillDimensionKey[]).map((dimKey) => {
                const item = readinessProfile[dimKey]
                return (
                  <div key={dimKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {item.score}%
                        </span>
                        <Badge
                          variant={
                            item.score >= 70
                              ? 'success'
                              : item.score >= 45
                              ? 'warning'
                              : 'destructive'
                          }
                          className="px-1.5 py-0 text-[9px] uppercase font-mono"
                        >
                          {item.confidence}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={item.score}
                      indicatorClassName={
                        item.score >= 70
                          ? 'bg-emerald-500'
                          : item.score >= 45
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }
                      aria-label={`${item.label} competency progress`}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Quick Actions Row (Where can I inspect deeper? - Jakob's Law convention) */}
      <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Continue Deliberate Practice</h4>
          <p className="text-xs text-zinc-400">
            Work through {recommendedResources.length} curated drills aligned with your target company patterns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveTab('resources')}
            className="rounded-full px-4 text-xs"
          >
            Browse Resources
          </Button>
          <Button
            size="sm"
            variant="glow"
            onClick={() => setActiveTab('practice')}
            className="rounded-full px-5 text-xs flex items-center gap-1.5"
          >
            <span>Launch Practice Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

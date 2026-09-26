import React from 'react'
import {
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Play,
  RotateCcw,
  Target,
  ExternalLink,
  BookOpen,
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
      {/* 1. Header Greeting & Countdown Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
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
            Targeting <strong className="text-indigo-300">{formatRole(profile.targetRole)}</strong> at{' '}
            <span className="text-zinc-300">{profile.college}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-right">
            <div className="text-xs text-zinc-400 font-medium">Placement Countdown</div>
            <div className="text-lg font-bold font-mono text-white flex items-center gap-1.5 justify-end">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{profile.daysUntilPlacement} Days Left</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-right">
            <div className="text-xs text-amber-300 font-medium">Study Streak</div>
            <div className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1.5 justify-end">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{streakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero: Overall Placement Readiness & "What Matters Now" */}
      <Card className="border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-950 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <CardContent className="p-6 sm:p-8 space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deterministic Readiness Assessment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Overall Placement Readiness Score
              </h2>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <strong className="text-indigo-400 font-semibold uppercase tracking-wider block text-[11px] mb-1">
                  What Matters Now:
                </strong>
                {whatMattersNow}
              </div>
            </div>

            {/* Circular / Radial Score Stat Box */}
            <div className="flex sm:flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 min-w-[200px] text-center shadow-lg">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/60 text-xs">
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
              <span className="text-base font-semibold text-indigo-300">Phase {currentPhase.phaseNumber}</span>
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
        {/* Left Column: Today's Recommended Plan (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">Today's Recommended Plan</CardTitle>
                    <CardDescription className="text-xs">
                      Engine allocated {todayPlan.totalEstimatedMinutes} mins of your {todayPlan.availableMinutes} min budget.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="cyan" className="font-mono text-xs">
                  {todayPlan.priorityFocus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayPlan.actions.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800">
                  You have completed today's recommended sessions! Great job staying on track.
                </div>
              ) : (
                todayPlan.actions.map((action, idx) => {
                  const isDone = action.isCompleted
                  return (
                    <div
                      key={action.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-950/10 text-zinc-400'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTodayAction(action.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-400 text-black'
                                : 'border-zinc-700 bg-zinc-900 hover:border-indigo-400'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm font-semibold ${
                                  isDone ? 'line-through text-zinc-400' : 'text-white'
                                }`}
                              >
                                {action.title}
                              </h4>
                              {idx === 0 && !isDone && (
                                <Badge variant="default" className="text-[10px] py-0">
                                  Top Focus
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                              {action.rationale}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-400" />
                                {action.estimatedMinutes} mins
                              </span>
                              <span>•</span>
                              <span className="capitalize">{action.dimension.replace('_', ' ')}</span>
                              {action.resource?.source && (
                                <>
                                  <span>•</span>
                                  <span>Source: {action.resource.source}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {action.resource?.sourceUrl && (
                            <a
                              href={action.resource.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                              title="Open original open-source reference"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Button
                            size="sm"
                            variant={isDone ? 'outline' : 'glow'}
                            onClick={() => toggleTodayAction(action.id)}
                            className="text-xs h-8"
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
          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="pb-3">
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
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  View Full Roadmap →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                {currentPhase.description}
              </p>
              <div className="space-y-2 pt-1">
                {currentPhase.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
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

        {/* Right Column: Skill Gaps & Readiness Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top 3 Skill Gaps */}
          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="pb-3">
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
            <CardContent className="space-y-3">
              {skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-200">{gap.title}</span>
                    <Badge variant="destructive" className="text-[10px] uppercase">
                      {gap.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{gap.impact}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-indigo-400 font-medium truncate max-w-[200px]">
                      {gap.actionToFix}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab('practice')}
                      className="text-[11px] h-7 px-2.5 hover:bg-zinc-800"
                    >
                      Fix this
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Readiness by Dimension Breakdown */}
          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white">Readiness Breakdown</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveTab('analytics')}
                  className="text-xs text-indigo-400"
                >
                  Full Matrix →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {(Object.keys(readinessProfile) as SkillDimensionKey[]).slice(0, 6).map((dimKey) => {
                const item = readinessProfile[dimKey]
                return (
                  <div key={dimKey} className="space-y-1">
                    <div className="flex justify-between text-zinc-300">
                      <span>{item.label}</span>
                      <span className="font-mono text-zinc-400 font-semibold">{item.score}%</span>
                    </div>
                    <Progress
                      value={item.score}
                      className="h-1.5"
                      indicatorClassName={
                        item.score > 70
                          ? 'bg-emerald-500'
                          : item.score > 45
                          ? 'bg-indigo-500'
                          : 'bg-rose-500'
                      }
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Recommended Practice Lab Quick Drills */}
      <Card className="border-zinc-800 bg-zinc-950/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white">Recommended Practice Drills</CardTitle>
              <CardDescription className="text-xs">
                Hand-picked from Striver A2Z, OSSU, and freeCodeCamp based on your weakest dimensions.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('resources')}
              className="text-xs"
            >
              Browse Full Catalog ({recommendedResources.length} available)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedResources.slice(0, 3).map((res) => {
              const isCompleted = completedResourceIds.includes(res.id)
              return (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="cyan" className="text-[10px]">
                        {res.category.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {res.estimatedMinutes}m • {res.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {res.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400">
                      Source: {res.source}
                    </span>
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'secondary'}
                      onClick={() => toggleResourceCompletion(res.id)}
                      className="text-xs h-7 px-3"
                    >
                      {isCompleted ? 'Completed ✓' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

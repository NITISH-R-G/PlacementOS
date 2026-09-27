import React, { useState } from 'react'
import {
  MapPin,
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export const RoadmapView: React.FC = () => {
  const { profile, recommendationOutput, setActiveTab } = usePlacementStore()
  const { roadmap } = recommendationOutput

  // Local task completion state for immediate feedback
  const [localCompletedTasks, setLocalCompletedTasks] = useState<Record<string, boolean>>({})

  const toggleTask = (taskId: string) => {
    setLocalCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-border/60 text-zinc-300 text-xs font-medium mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span>Target Role: {profile.targetRole.replace('_', ' ').toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Adaptive Placement Preparation Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Dynamic 4-phase sequence calibrated to your {profile.daysUntilPlacement}-day placement countdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full bg-zinc-900/90 border-border/60 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-xs"
            onClick={() => setActiveTab('dashboard')}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Sprint Overview Summary (Linear Cycles / Project Management convention) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-border/60 space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">Current Sprint</span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Phase 1: Foundations & DSA</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Days 1 - 30 of {profile.daysUntilPlacement}</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/80 border border-border/60 space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">Daily Target</span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{profile.availableHoursPerDay}h Dedicated Study</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Continuous Engine Calibration</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/80 border border-border/60 space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block">Total Milestone Tasks</span>
          <div className="text-sm font-bold text-white">
            {roadmap.reduce((acc, p) => acc + p.tasks.length, 0)} Engineering Tasks
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Structured Across 4 Sprints</span>
        </div>
      </div>

      {/* Roadmap Phase Timeline Cards (Linear / GitHub Milestones pattern) */}
      <div className="space-y-6 relative">
        {roadmap.map((phase) => {
          const completedCount = phase.tasks.filter((t) => localCompletedTasks[t.id] ?? t.completed).length
          const phaseProgress = Math.round((completedCount / phase.tasks.length) * 100)

          return (
            <Card
              key={phase.id}
              className={`border transition-all duration-300 ${
                phase.isCurrent
                  ? 'border-border/90 bg-[#0d0e14]/95 shadow-[0_0_30px_-10px_rgba(255,255,255,0.08)]'
                  : 'border-border/40 bg-[#0c0d12]/70 hover:border-border/80'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider transition-colors ${
                        phase.isCurrent
                          ? 'bg-white text-black shadow-lg shadow-white/10'
                          : 'bg-zinc-900 border border-border/60 text-zinc-400'
                      }`}
                    >
                      P{phase.phaseNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <CardTitle className="text-base text-white font-semibold">
                          {phase.phaseTitle}
                        </CardTitle>
                        {phase.isCurrent ? (
                          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                            Current Sprint
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full text-zinc-400 border-border/50">
                            Planned
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-zinc-400 flex items-center gap-2 mt-1 font-mono">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {phase.daysWindow}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {phase.focusAreas.map((area) => (
                      <Badge
                        key={area}
                        variant="secondary"
                        className="text-[10px] uppercase font-mono bg-zinc-900/90 text-zinc-300 border-border/40 px-2 py-0.5"
                      >
                        {area.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {phase.description}
                </p>

                {/* Progress meter per phase */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Phase Completion</span>
                    <span className="font-mono">{phaseProgress}%</span>
                  </div>
                  <Progress value={phaseProgress} aria-label={`${phase.phaseTitle} progress`} />
                </div>

                <Separator className="bg-border/40" />

                {/* Milestone Deliverable Tasks */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Milestone Deliverables:</span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {completedCount} / {phase.tasks.length} Completed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phase.tasks.map((task) => {
                      const isTaskDone = localCompletedTasks[task.id] ?? task.completed

                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          tabIndex={0}
                          role="checkbox"
                          aria-checked={isTaskDone}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault()
                              toggleTask(task.id)
                            }
                          }}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                            isTaskDone
                              ? 'bg-zinc-950/40 border-border/30 opacity-70'
                              : 'bg-zinc-900/60 border-border/50 hover:border-white/20 hover:bg-zinc-900/90'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              checked={isTaskDone}
                              onCheckedChange={() => toggleTask(task.id)}
                              aria-label={`Mark task ${task.title}`}
                            />
                            <span className={isTaskDone ? 'line-through text-zinc-500' : 'text-zinc-200 font-medium'}>
                              {task.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-2">
                            ~{task.estimatedHours}h
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {phase.isCurrent && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="glow"
                      onClick={() => setActiveTab('practice')}
                      className="rounded-full px-4 text-xs flex items-center gap-1.5"
                    >
                      <span>Practice Phase 1 Drills</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

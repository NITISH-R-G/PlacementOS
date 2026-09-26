import React from 'react'
import {
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const RoadmapView: React.FC = () => {
  const { profile, recommendationOutput, setActiveTab } = usePlacementStore()
  const { roadmap } = recommendationOutput

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
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
            onClick={() => setActiveTab('dashboard')}
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Roadmap Phase Timeline Cards */}
      <div className="space-y-6">
        {roadmap.map((phase) => {
          return (
            <Card
              key={phase.id}
              className={`border transition-all ${
                phase.isCurrent
                  ? 'border-indigo-500/40 bg-zinc-950/90 shadow-indigo-500/10 shadow-xl'
                  : 'border-zinc-800/80 bg-zinc-950/50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        phase.isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      P{phase.phaseNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base text-white">
                          {phase.phaseTitle}
                        </CardTitle>
                        {phase.isCurrent && (
                          <Badge variant="cyan" className="text-[10px]">
                            Current Sprint
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {phase.daysWindow}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {phase.focusAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-[10px] uppercase font-mono">
                        {area.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {phase.description}
                </p>

                {/* Milestone Tasks */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Milestone Deliverables:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              task.completed ? 'text-emerald-400' : 'text-zinc-600'
                            }`}
                          />
                          <span className={task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-2">
                          ~{task.estimatedHours}h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
  Flame,
  Lightbulb,
  Check,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { SkillDimensionKey } from '@/types'

export const AnalyticsView: React.FC = () => {
  const { recommendationOutput, streakDays, totalHoursStudied, completedResourceIds } =
    usePlacementStore()
  const { readinessProfile, overallScore } = recommendationOutput

  const chartData = (Object.keys(readinessProfile) as SkillDimensionKey[]).map((key) => {
    const item = readinessProfile[key]
    return {
      name: item.label.split(' ')[0], // short name
      fullName: item.label,
      score: item.score,
    }
  })

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2.5">
            <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 font-medium border-white/[0.1] bg-white/[0.03] text-zinc-300">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
              <span>Placement Telemetry & Insights</span>
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Preparation Analytics & Readiness Velocity
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time telemetry measuring dimensional competencies, consistency streaks, and placement alignment.
          </p>
        </div>
      </div>
      <Separator className="bg-white/[0.08]" />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              Aggregate Readiness
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">{overallScore}%</div>
            <p className="text-[11px] text-emerald-400 font-medium">+4% over baseline</p>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Consistency Streak
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tracking-tight">{streakDays} Days</div>
            <p className="text-[11px] text-zinc-400 font-mono">Target: 30 days unbroken</p>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-300" />
              Time Invested
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">{totalHoursStudied} Hours</div>
            <p className="text-[11px] text-zinc-400">Across all 10 modules</p>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-xl backdrop-blur-xl">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Drills Completed
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {completedResourceIds.length} Modules
            </div>
            <p className="text-[11px] text-zinc-400">Validated topics</p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Bar Chart: Readiness by Category */}
      <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base text-white font-bold tracking-tight">Dimensional Readiness Breakdown</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Normalized readiness index (0 - 100) evaluated against target role standards.
              </CardDescription>
            </div>
            {/* Visual Threshold Legend */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>&gt;70% Optimal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-white" />
                <span>45-70% In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>&lt;45% Priority Gap</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="p-3 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs shadow-2xl">
                          <span className="font-semibold text-white block mb-1">
                            {data.fullName}
                          </span>
                          <span className="text-zinc-200 font-mono font-bold">
                            Score: {data.score}%
                          </span>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.score > 70
                          ? '#10b981'
                          : entry.score > 45
                          ? '#ffffff'
                          : '#f43f5e'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dimensional Metric Meters (using shadcn Progress & Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(readinessProfile) as SkillDimensionKey[]).map((key) => {
          const dim = readinessProfile[key]
          const isHigh = dim.score >= 70
          const isMid = dim.score >= 45 && dim.score < 70
          return (
            <Card key={key} className="border-white/[0.08] bg-[#0c0d12]/90 shadow-sm backdrop-blur-xl">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{dim.label}</span>
                  </div>
                  <Badge
                    variant={isHigh ? 'success' : isMid ? 'secondary' : 'destructive'}
                    className="text-[11px] font-mono px-2 py-0.5"
                  >
                    {dim.score}%
                  </Badge>
                </div>
                <Progress value={dim.score} aria-label={`${dim.label} mastery`} className="h-2 bg-zinc-900" />
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Weight: High</span>
                  <span className={isHigh ? 'text-emerald-400' : isMid ? 'text-zinc-300' : 'text-rose-400'}>
                    {isHigh ? 'Optimal proficiency' : isMid ? 'Approaching benchmark' : 'Requires dedicated drill'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Weekly Consistency Visualizer */}
      <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-xl backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-white font-bold tracking-tight">Weekly Consistency Heatmap</CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Daily practice sessions completed over the active training cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {daysOfWeek.map((day, idx) => {
              const isActive = idx <= streakDays
              return (
                <div key={day} className="space-y-1.5">
                  <span className="text-[11px] text-zinc-400 font-medium">{day}</span>
                  <div
                    className={`h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                      isActive
                        ? 'border-white/20 bg-white/10 text-white shadow-sm'
                        : 'border-white/[0.04] bg-zinc-950/40 text-zinc-600'
                    }`}
                  >
                    {isActive ? <Check className="w-4 h-4 text-emerald-400" /> : '-'}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actionable Engineering Insights using shadcn Alert */}
      <Alert className="border-white/[0.08] bg-zinc-950/80 shadow-md">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <AlertTitle className="text-white font-semibold text-sm">Engine Telemetry Insights</AlertTitle>
        <AlertDescription className="text-zinc-400 text-xs mt-1.5">
          <ul className="space-y-1.5 text-[11px] list-disc list-inside">
            <li><strong className="text-zinc-200">Velocity:</strong> Current trajectory projects an 85% composite score before Day 45.</li>
            <li><strong className="text-zinc-200">Focus Recommendation:</strong> Prioritize 2 relational schema normalization drills this week to boost database score.</li>
            <li><strong className="text-zinc-200">Cadence:</strong> Maintaining your {streakDays}-day streak satisfies the consistency threshold for top-tier campus recruitment drives.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}

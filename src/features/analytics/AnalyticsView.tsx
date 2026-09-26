import React from 'react'
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Preparation Analytics & Readiness Velocity
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time telemetry measuring dimensional competencies, consistency streaks, and placement alignment.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Aggregate Readiness
            </span>
            <div className="text-2xl font-bold font-mono text-white">{overallScore}%</div>
            <p className="text-[11px] text-emerald-400 font-medium">+4% over baseline</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Consistency Streak
            </span>
            <div className="text-2xl font-bold font-mono text-amber-400">{streakDays} Days</div>
            <p className="text-[11px] text-zinc-400">Target: 30 days unbroken</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Time Invested
            </span>
            <div className="text-2xl font-bold font-mono text-white">{totalHoursStudied} Hours</div>
            <p className="text-[11px] text-zinc-400">Across all 10 modules</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Drills Completed
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {completedResourceIds.length} Modules
            </div>
            <p className="text-[11px] text-zinc-400">Validated topics</p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Bar Chart: Readiness by Category */}
      <Card className="border-zinc-800 bg-zinc-950/80">
        <CardHeader>
          <CardTitle className="text-base text-white">Dimensional Readiness Breakdown</CardTitle>
          <CardDescription className="text-xs">
            Normalized readiness index (0 - 100) evaluated against target role standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
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
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs shadow-xl">
                          <span className="font-semibold text-white block mb-1">
                            {data.fullName}
                          </span>
                          <span className="text-indigo-400 font-mono font-bold">
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
                          ? '#6366f1'
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

      {/* Weekly Consistency Visualizer */}
      <Card className="border-zinc-800 bg-zinc-950/80">
        <CardHeader>
          <CardTitle className="text-base text-white">Weekly Consistency Heatmap</CardTitle>
          <CardDescription className="text-xs">
            Daily practice sessions completed over the active training cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {daysOfWeek.map((day, idx) => {
              const isActive = idx <= streakDays
              return (
                <div key={day} className="space-y-1.5">
                  <span className="text-[11px] text-zinc-400">{day}</span>
                  <div
                    className={`h-12 rounded-lg border flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                      isActive
                        ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-600'
                    }`}
                  >
                    {isActive ? '✓' : '-'}
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

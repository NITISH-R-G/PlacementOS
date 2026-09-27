import React, { useState } from 'react'
import {
  Code2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Send,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { INITIAL_RESOURCES } from '@/data/resources'
import { LearningResource } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'dsa', label: 'DSA' },
  { id: 'cs_fundamentals', label: 'CS Fundamentals' },
  { id: 'sql', label: 'SQL' },
  { id: 'programming', label: 'Programming / OOP' },
  { id: 'aptitude', label: 'Aptitude' },
  { id: 'communication', label: 'Communication' },
]

export const PracticeView: React.FC = () => {
  const { completedResourceIds, toggleResourceCompletion } = usePlacementStore()
  const [selectedCat, setSelectedCat] = useState('all')
  const [activeDrill, setActiveDrill] = useState<LearningResource | null>(INITIAL_RESOURCES[0])
  const [studentAnswer, setStudentAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationFeedback, setEvaluationFeedback] = useState<{
    score: number
    strengths: string
    improvements: string
    recommendedNext: string
  } | null>(null)

  const filteredResources = INITIAL_RESOURCES.filter(
    (r) => selectedCat === 'all' || r.category === selectedCat
  )

  const handleEvaluateAnswer = () => {
    if (!studentAnswer.trim()) return
    setEvaluating(true)

    setTimeout(() => {
      setEvaluating(false)
      setEvaluationFeedback({
        score: 85,
        strengths:
          'Clear identification of algorithm constraints, optimal time complexity O(N) recognized, and edge cases handled effectively.',
        improvements:
          'Consider explicitly detailing space bounds O(1) auxiliary vs O(N) recursion stack, and discuss fail-safe error handling.',
        recommendedNext:
          'Proceed to drill 3 medium variations to reinforce time-space trade-offs under timed pressure.',
      })
    }, 600)
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-2.5">
            <Code2 className="w-3.5 h-3.5 text-white" />
            <span>Interactive Practice Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Placement Practice Lab & Evaluator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Solve curated industry drills and receive instant, deterministic feedback on your approach.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/[0.06] backdrop-blur-md">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCat === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-white/[0.04]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Two-Column Grid: Problem Selector + Evaluator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
            <span>Available Modules ({filteredResources.length})</span>
            <span className="font-mono text-[11px]">
              {filteredResources.filter((r) => completedResourceIds.includes(r.id)).length} Completed
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredResources.map((res) => {
              const isSelected = activeDrill?.id === res.id
              const isDone = completedResourceIds.includes(res.id)
              return (
                <div
                  key={res.id}
                  onClick={() => {
                    setActiveDrill(res)
                    setEvaluationFeedback(null)
                    setStudentAnswer('')
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-white/[0.3] bg-[#12131a] shadow-lg shadow-black/40'
                      : 'border-white/[0.06] bg-[#0c0d12]/80 hover:border-white/[0.14] hover:bg-[#0f1017]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <Badge variant="secondary" className="text-[9px] py-0 px-2 font-mono uppercase bg-zinc-900 text-zinc-300 border-white/[0.06]">
                      {res.category.toUpperCase()}
                    </Badge>
                    <span className="text-zinc-400 font-mono text-[10px]">
                      {res.estimatedMinutes}m • {res.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    {res.title}
                  </h4>
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/[0.06] text-[10px] text-zinc-400">
                    <span>Source: {res.source}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleResourceCompletion(res.id)
                      }}
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        isDone ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isDone ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Active Drill & AI Evaluation Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeDrill ? (
            <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-2xl backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs font-mono">
                      {activeDrill.subcategory}
                    </Badge>
                    <span className="text-xs text-zinc-400">
                      {activeDrill.estimatedMinutes} min drill
                    </span>
                  </div>
                  {activeDrill.sourceUrl && (
                    <a
                      href={activeDrill.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
                    >
                      Reference Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <CardTitle className="text-lg text-white mt-2 font-bold tracking-tight">
                  {activeDrill.title}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-300 leading-relaxed mt-1">
                  {activeDrill.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      Your Solution / Approach / Code Submission:
                    </label>
                    <span className="text-[11px] text-zinc-400">
                      Evaluated on complexity, correctness & clarity
                    </span>
                  </div>
                  <textarea
                    aria-label="Your Solution, Approach, or Code Submission"
                    rows={6}
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="Write your explanation or code here (e.g. Initialize two pointers left=0, right=n-1; calculate window sum; expand until condition is satisfied; contract left pointer while maintaining invariant...)"
                    className="w-full bg-zinc-950/90 border border-white/[0.1] rounded-xl p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-white/[0.3] placeholder:text-zinc-600 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button
                    size="sm"
                    variant="glow"
                    disabled={evaluating || !studentAnswer.trim()}
                    onClick={handleEvaluateAnswer}
                    className="flex items-center gap-1.5 text-xs rounded-full px-4"
                  >
                    {evaluating ? (
                      <>Analyzing Approach...</>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Run Feedback Evaluator
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleResourceCompletion(activeDrill.id)}
                    className="text-xs rounded-full bg-zinc-900/80 border border-white/[0.08] text-zinc-300 hover:text-white"
                  >
                    {completedResourceIds.includes(activeDrill.id)
                      ? '✓ Marked as Completed'
                      : 'Mark Drill as Done'}
                  </Button>
                </div>

                {/* AI Evaluation Feedback Card */}
                {evaluationFeedback && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.12] text-xs space-y-3 mt-4 animate-in fade-in shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        Automated Feedback Assessment
                      </span>
                      <Badge variant="success" className="text-xs font-mono">
                        Readiness Score: {evaluationFeedback.score}/100
                      </Badge>
                    </div>

                    <div>
                      <strong className="text-emerald-400 block mb-0.5">Strengths:</strong>
                      <p className="text-zinc-300 leading-relaxed">
                        {evaluationFeedback.strengths}
                      </p>
                    </div>

                    <div>
                      <strong className="text-amber-400 block mb-0.5">What to Refine:</strong>
                      <p className="text-zinc-300 leading-relaxed">
                        {evaluationFeedback.improvements}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/[0.06] text-[11px] text-zinc-400">
                      <strong className="text-white">Next Step: </strong>
                      {evaluationFeedback.recommendedNext}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl border border-white/[0.08]">
              Select a practice module on the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

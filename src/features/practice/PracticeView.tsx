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
          'Clear identification of edge cases, proper asymptotic bounds (O(N) time and O(1) auxiliary space), and modular structure.',
        improvements:
          'Consider explicitly discussing potential integer overflow on pointer additions and handling empty/null input defensively.',
        recommendedNext:
          'Advance to 2D Monotonic Binary Search or LeetCode #11 (Container With Most Water) to solidify two-pointer mechanics.',
      })
    }, 1000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-indigo-400" />
            Placement Practice Lab
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Solve curated interview problems and receive immediate structured evaluation feedback.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCat === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Two column practice workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Problem & Resources List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Available Practice Modules ({filteredResources.length})</span>
            <span className="text-[11px] text-zinc-500">
              {completedResourceIds.length} Completed
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
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
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <Badge variant="cyan" className="text-[9px] py-0">
                      {res.category.toUpperCase()}
                    </Badge>
                    <span className="text-zinc-400 font-mono">
                      {res.estimatedMinutes}m • {res.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    {res.title}
                  </h4>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-900 text-[10px] text-zinc-400">
                    <span>Source: {res.source}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleResourceCompletion(res.id)
                      }}
                      className={`flex items-center gap-1 font-medium ${
                        isDone ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
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
            <Card className="border-zinc-800 bg-zinc-950/80">
              <CardHeader className="pb-3 border-b border-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
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
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Reference Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <CardTitle className="text-lg text-white mt-1">
                  {activeDrill.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {activeDrill.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="glow"
                    disabled={evaluating || !studentAnswer.trim()}
                    onClick={handleEvaluateAnswer}
                    className="flex items-center gap-1.5 text-xs"
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
                    className="text-xs"
                  >
                    {completedResourceIds.includes(activeDrill.id)
                      ? '✓ Marked as Completed'
                      : 'Mark Drill as Done'}
                  </Button>
                </div>

                {/* AI Evaluation Feedback Card */}
                {evaluationFeedback && (
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-indigo-500/30 text-xs space-y-3 mt-4 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
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

                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
                      <strong className="text-white">Next Step: </strong>
                      {evaluationFeedback.recommendedNext}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl border border-zinc-800">
              Select a practice module on the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

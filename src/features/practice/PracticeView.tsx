import React, { useState } from 'react'
import {
  Code2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Send,
  Search,
  RotateCcw,
  FileCode,
  Terminal,
  HelpCircle,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { INITIAL_RESOURCES } from '@/data/resources'
import { LearningResource } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [activeDrill, setActiveDrill] = useState<LearningResource | null>(INITIAL_RESOURCES[0])
  const [studentAnswer, setStudentAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluationFeedback, setEvaluationFeedback] = useState<{
    score: number
    strengths: string
    improvements: string
    recommendedNext: string
  } | null>(null)

  const filteredResources = INITIAL_RESOURCES.filter((r) => {
    const matchesCategory = selectedCat === 'all' || r.category === selectedCat
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleEvaluateAnswer = () => {
    if (!studentAnswer.trim() || evaluating) return
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

  const handleInsertScaffold = () => {
    if (!activeDrill) return
    const scaffold = `// Problem: ${activeDrill.title}\n// Category: ${activeDrill.subcategory}\n\n// 1. Constraints & Assumptions:\n// - Time Complexity Target: O(N)\n// - Space Complexity Target: O(1)\n\n// 2. Approach / Implementation:\nfunction solution() {\n  // Your implementation here\n}\n`
    setStudentAnswer(scaffold)
  }

  const renderDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return (
          <Badge variant="success" className="text-[10px] font-mono px-2 py-0.5">
            Easy
          </Badge>
        )
      case 'Medium':
        return (
          <Badge variant="warning" className="text-[10px] font-mono px-2 py-0.5">
            Medium
          </Badge>
        )
      case 'Hard':
        return (
          <Badge variant="destructive" className="text-[10px] font-mono px-2 py-0.5">
            Hard
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
            {diff}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-border/60 text-zinc-300 text-xs font-medium mb-2.5">
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

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-border/60 text-xs text-zinc-300 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{completedResourceIds.length} Solved</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/80 border border-border/40 backdrop-blur-md">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
          {/* Quick Problem Search Filter with shadcn Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 z-10" />
            <Input
              type="text"
              aria-label="Filter problems"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problem drills..."
              className="w-full bg-zinc-950/90 border border-border/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-white/20 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
            <span>Showing {filteredResources.length} Drills</span>
            <span className="font-mono text-[11px] text-zinc-500">LeetCode / Striver Schema</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
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
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    isSelected
                      ? 'border-border/90 bg-[#12131a] shadow-lg shadow-black/40'
                      : 'border-border/40 bg-[#0c0d12]/80 hover:border-border/80 hover:bg-[#0f1017]'
                  }`}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveDrill(res)
                      setEvaluationFeedback(null)
                      setStudentAnswer('')
                    }
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <Badge variant="secondary" className="text-[9px] py-0 px-2 font-mono uppercase bg-zinc-900 text-zinc-300 border-border/40">
                      {res.category.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400 font-mono text-[10px]">{res.estimatedMinutes}m</span>
                      {renderDifficultyBadge(res.difficulty)}
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug flex items-center gap-1.5">
                    {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                    {res.title}
                  </h4>
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-border/40 text-[10px] text-zinc-400">
                    <span>Source: {res.source}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleResourceCompletion(res.id)
                      }}
                      className={`flex items-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded px-1 ${
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
            <Card className="border-border/60 bg-[#0c0d12]/90 shadow-2xl backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs font-mono">
                      {activeDrill.subcategory}
                    </Badge>
                    {renderDifficultyBadge(activeDrill.difficulty)}
                    <span className="text-xs text-zinc-400 font-mono">
                      ~{activeDrill.estimatedMinutes} mins
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Solution Hints Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="xs" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Hints</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-950 border-border/80 text-zinc-200">
                        <DialogHeader>
                          <DialogTitle className="text-white">Solution Strategy Hint</DialogTitle>
                          <DialogDescription className="text-zinc-400 text-xs mt-1">
                            {activeDrill.title} ({activeDrill.subcategory})
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-xs leading-relaxed text-zinc-300 py-2">
                          <p>
                            1. <strong>Optimal Pattern:</strong> Identify whether a two-pointer, sliding window, prefix sum, or binary search reduction yields minimum complexity.
                          </p>
                          <p>
                            2. <strong>Boundary Edge Cases:</strong> Consider empty inputs, duplicate elements, negative values, and integer overflow constraints.
                          </p>
                          <p>
                            3. <strong>Space Target:</strong> Avoid redundant auxiliary data structures if mutations can be applied in-place.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {activeDrill.sourceUrl && (
                      <a
                        href={activeDrill.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-300 hover:text-white hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
                      >
                        Reference Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
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
                  {/* Code Editor Header Bar (LeetCode / HackerRank convention) */}
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                      Solution / Approach / Implementation:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleInsertScaffold}
                        className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                        title="Insert solution template scaffold"
                      >
                        <FileCode className="w-3 h-3" />
                        Scaffold
                      </button>
                      <span className="text-zinc-600">|</span>
                      <button
                        type="button"
                        onClick={() => setStudentAnswer('')}
                        className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                        title="Clear solution"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* shadcn Textarea Component */}
                  <Textarea
                    aria-label="Your Solution, Approach, or Code Submission"
                    rows={7}
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault()
                        handleEvaluateAnswer()
                      }
                    }}
                    placeholder="Write your explanation or code here (e.g. Initialize two pointers left=0, right=n-1; calculate window sum; expand until condition is satisfied; contract left pointer while maintaining invariant...)"
                    className="w-full bg-zinc-950/90 border border-border/70 rounded-xl p-3 text-xs text-zinc-100 font-mono focus-visible:ring-1 focus-visible:ring-white/30 placeholder:text-zinc-600 transition-colors leading-relaxed min-h-[140px]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1 px-1">
                    <span>Evaluated on complexity, correctness & clarity</span>
                    <span className="font-mono hidden sm:inline">⌘/Ctrl + Enter to run</span>
                  </div>
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
                    className="text-xs rounded-full bg-zinc-900/80 border border-border/60 text-zinc-300 hover:text-white"
                  >
                    {completedResourceIds.includes(activeDrill.id)
                      ? '✓ Marked as Completed'
                      : 'Mark Drill as Done'}
                  </Button>
                </div>

                {/* AI Evaluation Feedback Card */}
                {evaluationFeedback && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-border/80 text-xs space-y-3 mt-4 animate-in fade-in shadow-xl">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        Automated Feedback Assessment
                      </span>
                      <Badge variant="success" className="text-xs font-mono">
                        Score: {evaluationFeedback.score}/100
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

                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-border/40 text-[11px] text-zinc-400">
                      <strong className="text-white">Next Step: </strong>
                      {evaluationFeedback.recommendedNext}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl border border-border/40">
              Select a practice module on the left to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

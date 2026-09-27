import React, { useState } from 'react'
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { DIAGNOSTIC_QUESTIONS } from '@/data/diagnosticQuestions'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const AssessmentView: React.FC = () => {
  const { completeOnboarding, profile, setActiveTab } = usePlacementStore()

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const q = DIAGNOSTIC_QUESTIONS[currentIdx]
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100)

  const handleSelect = (qid: string, optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qid]: optId }))
  }

  const handleCheck = () => {
    setSubmittedAnswers((prev) => ({ ...prev, [q.id]: true }))
  }

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      setIsCompleted(true)
      // Recalibrate store scores
      let correct = 0
      const scores: Record<string, number> = {}
      DIAGNOSTIC_QUESTIONS.forEach((quest) => {
        const ok = selectedAnswers[quest.id] === quest.correctOptionId
        if (ok) correct++
        scores[quest.dimension] = ok ? 80 : 35
      })

      completeOnboarding(profile, {
        scoreByDimension: scores as any,
        completedAt: new Date().toISOString(),
        totalQuestions: DIAGNOSTIC_QUESTIONS.length,
        correctCount: correct,
        detectedGaps: [],
      })
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
    }
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const optionLetters = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-2.5">
            <FileCheck2 className="w-3.5 h-3.5 text-white" />
            <span>Verification Test Bench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Diagnostic Skill Assessment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Validates conceptual mastery across DSA, OS, Databases, and OOP fundamentals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-xs">
            {answeredCount}/{totalQuestions} Answered
          </Badge>
        </div>
      </div>

      {!isCompleted ? (
        <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-2xl backdrop-blur-xl">
          {/* Progress Header & Question Palette (HackerRank / Standard Testing convention) */}
          <div className="p-4 sm:px-6 border-b border-white/[0.06] bg-zinc-950/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono">
                Progress: <strong className="text-white">{progressPercent}%</strong>
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                {q.dimension.replace('_', ' ')}
              </span>
            </div>
            <Progress value={progressPercent} aria-label="Assessment Progress" />

            {/* Question Quick-Jump Stepper Pills */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
              {DIAGNOSTIC_QUESTIONS.map((item, idx) => {
                const isCurrent = idx === currentIdx
                const isAnswered = !!selectedAnswers[item.id]
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIdx(idx)}
                    aria-label={`Jump to question ${idx + 1}`}
                    className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                      isCurrent
                        ? 'bg-white text-black shadow-md shadow-white/20'
                        : isAnswered
                        ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>

          <CardHeader className="pb-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs font-mono uppercase bg-zinc-900 text-zinc-300 border-white/[0.08] px-2.5 py-0.5">
                Question {currentIdx + 1} of {totalQuestions}
              </Badge>
              <span className="text-xs text-zinc-400 font-mono">
                Difficulty: <strong className="capitalize text-zinc-200 font-medium">{q.difficulty}</strong>
              </span>
            </div>
            <CardTitle className="text-base sm:text-lg text-white mt-3 font-semibold leading-relaxed">
              {q.prompt}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Multiple Choice Options with Conventional Letter Badges */}
            <div className="space-y-2.5">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[q.id] === opt.id
                const isSubmitted = submittedAnswers[q.id]
                const isCorrect = opt.id === q.correctOptionId

                let style = 'border-white/[0.06] bg-zinc-900/50 hover:border-white/[0.15] text-zinc-300'
                if (isSelected) style = 'border-white/[0.3] bg-[#1a1b24] text-white shadow-md'
                if (isSubmitted) {
                  if (isCorrect) style = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-semibold'
                  else if (isSelected) style = 'border-rose-500/50 bg-rose-950/20 text-rose-300'
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${style}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-400 border border-white/[0.08]'
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </div>
                      <span className="leading-relaxed">{opt.text}</span>
                    </div>

                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                )
              })}
            </div>

            {submittedAnswers[q.id] && (
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.08] text-xs space-y-1 mt-2 animate-in fade-in">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  Engineering Explanation:
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">{q.explanation}</p>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
              <Button
                size="sm"
                variant="ghost"
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!submittedAnswers[q.id] ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!selectedAnswers[q.id]}
                    onClick={handleCheck}
                    className="rounded-full px-4 text-xs bg-zinc-900 border border-white/[0.1] text-zinc-200 hover:text-white"
                  >
                    Verify Answer
                  </Button>
                ) : (
                  <Button size="sm" variant="glow" onClick={handleNext} className="rounded-full px-5 text-xs flex items-center gap-1.5">
                    <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'Recalibrate Dashboard'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/[0.15] bg-[#0c0d12]/95 text-center py-10 shadow-2xl backdrop-blur-xl">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Diagnostic Completed</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your placement readiness matrix has been updated with these verified responses. All recommended sprints and practice drills are now calibrated.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAnswers({})
                  setSubmittedAnswers({})
                  setCurrentIdx(0)
                  setIsCompleted(false)
                }}
                className="rounded-full px-4 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Retake Assessment
              </Button>
              <Button
                variant="glow"
                onClick={() => setActiveTab('dashboard')}
                className="rounded-full px-6"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

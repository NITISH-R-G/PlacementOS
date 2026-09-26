import React, { useState } from 'react'
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { DIAGNOSTIC_QUESTIONS } from '@/data/diagnosticQuestions'
import { usePlacementStore } from '@/store/usePlacementStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const AssessmentView: React.FC = () => {
  const { diagnosticResult, completeOnboarding, profile, setActiveTab } = usePlacementStore()

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const q = DIAGNOSTIC_QUESTIONS[currentIdx]

  const handleSelect = (qid: string, optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qid]: optId }))
  }

  const handleCheck = () => {
    setSubmittedAnswers((prev) => ({ ...prev, [q.id]: true }))
  }

  const handleNext = () => {
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-indigo-400" />
            Diagnostic Skill Assessment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Validates conceptual mastery across DSA, OS, Databases, and OOP fundamentals.
          </p>
        </div>
      </div>

      {!isCompleted ? (
        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="cyan" className="text-xs">
                Question {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}
              </Badge>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                {q.dimension.replace('_', ' ')}
              </span>
            </div>
            <CardTitle className="text-base sm:text-lg text-white mt-2 leading-relaxed">
              {q.prompt}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {q.options.map((opt) => {
                const isSelected = selectedAnswers[q.id] === opt.id
                const isSubmitted = submittedAnswers[q.id]
                const isCorrect = opt.id === q.correctOptionId

                let style = 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                if (isSelected) style = 'border-indigo-500 bg-indigo-500/10 text-white'
                if (isSubmitted) {
                  if (isCorrect) style = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                  else if (isSelected) style = 'border-rose-500 bg-rose-500/10 text-rose-300'
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`w-full p-3.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${style}`}
                  >
                    <span>{opt.text}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isSubmitted && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400" />}
                  </button>
                )
              })}
            </div>

            {submittedAnswers[q.id] && (
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <span className="font-semibold text-zinc-200">Explanation:</span>
                <p className="text-zinc-400 leading-relaxed">{q.explanation}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
              <span className="text-xs text-zinc-500">
                Difficulty: <strong className="capitalize text-zinc-400">{q.difficulty}</strong>
              </span>

              {!submittedAnswers[q.id] ? (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!selectedAnswers[q.id]}
                  onClick={handleCheck}
                >
                  Verify Answer
                </Button>
              ) : (
                <Button size="sm" variant="glow" onClick={handleNext}>
                  {currentIdx < DIAGNOSTIC_QUESTIONS.length - 1 ? 'Next Question →' : 'Recalibrate Dashboard'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-indigo-500/30 bg-zinc-950/80 text-center py-8">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Diagnostic Completed</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your placement readiness matrix has been updated with these verified responses.
            </p>
            <div className="pt-2">
              <Button
                variant="glow"
                onClick={() => setActiveTab('dashboard')}
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

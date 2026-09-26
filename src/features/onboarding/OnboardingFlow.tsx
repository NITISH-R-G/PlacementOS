import React, { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  BookOpen,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { TargetRole, SkillLevel, StudentProfile, DiagnosticResult } from '@/types'
import { DIAGNOSTIC_QUESTIONS } from '@/data/diagnosticQuestions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ROLES: { id: TargetRole; label: string; desc: string }[] = [
  { id: 'software_engineer', label: 'Software Engineer (General)', desc: 'DSA, CS Fundamentals, OOP, System Architecture' },
  { id: 'frontend_developer', label: 'Frontend Developer', desc: 'UI Architecture, React/TS, State, Web Performance' },
  { id: 'backend_developer', label: 'Backend Developer', desc: 'APIs, Relational DBs/SQL, OS Concurrency, Microservices' },
  { id: 'data_analyst', label: 'Data Analyst', desc: 'Advanced SQL, Analytical Queries, Aptitude, Data Modeling' },
  { id: 'data_scientist', label: 'Data Scientist', desc: 'Python, Math/Stats, Machine Learning, Data Processing' },
  { id: 'aiml_engineer', label: 'AI / ML Engineer', desc: 'Algorithms, Model Deployment, Python, Linear Algebra' },
  { id: 'product_tech', label: 'Product / Tech Specialist', desc: 'Engineering Communication, Architecture, Problem Solving' },
]

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, setActiveTab } = usePlacementStore()

  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Profile Form State
  const [name, setName] = useState('Arjun Sharma')
  const [college, setCollege] = useState('Chennai Institute of Technology')
  const [degree, setDegree] = useState('B.E. Computer Science')
  const [currentYear, setCurrentYear] = useState('3rd Year (6th Sem)')
  const [targetGraduationYear] = useState(2026)
  const [targetRole, setTargetRole] = useState<TargetRole>('software_engineer')
  const [currentSkillLevel, setCurrentSkillLevel] = useState<SkillLevel>('intermediate')
  const [availableHoursPerDay, setAvailableHoursPerDay] = useState(2.5)
  const [daysUntilPlacement, setDaysUntilPlacement] = useState(73)

  // Diagnostic Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({})

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleConfirmAnswer = () => {
    const q = DIAGNOSTIC_QUESTIONS[currentQIndex]
    setSubmittedAnswers((prev) => ({ ...prev, [q.id]: true }))
  }

  const handleNextQuestion = () => {
    if (currentQIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1)
    } else {
      // Complete diagnostic
      setStep(3)
    }
  }

  // Calculate diagnostic result
  const computeDiagnostic = (): DiagnosticResult => {
    let correct = 0
    const dimScoreMap: Partial<Record<string, number>> = {}
    const gaps: string[] = []

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const isCorrect = selectedAnswers[q.id] === q.correctOptionId
      if (isCorrect) correct++
      else {
        gaps.push(`${q.dimension.toUpperCase()} gap detected`)
      }
      dimScoreMap[q.dimension] = isCorrect ? 75 : 30
    })

    return {
      scoreByDimension: dimScoreMap as any,
      completedAt: new Date().toISOString(),
      totalQuestions: DIAGNOSTIC_QUESTIONS.length,
      correctCount: correct,
      detectedGaps: gaps,
    }
  }

  const handleFinishOnboarding = () => {
    const diag = computeDiagnostic()
    const profile: StudentProfile = {
      id: `usr-${Date.now()}`,
      name: name || 'Student',
      college: college || 'Engineering College',
      degree: degree || 'B.Tech / B.E.',
      currentYear,
      targetGraduationYear,
      targetRole,
      currentSkillLevel,
      availableHoursPerDay,
      placementDate: new Date(Date.now() + daysUntilPlacement * 24 * 60 * 60 * 1000).toISOString(),
      daysUntilPlacement,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    completeOnboarding(profile, diag)
    setActiveTab('dashboard')
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            1
          </span>
          <span className={step === 1 ? 'font-semibold text-white' : 'text-zinc-400'}>
            Profile Setup
          </span>
        </div>
        <div className="h-[1px] w-12 bg-zinc-800" />
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            2
          </span>
          <span className={step === 2 ? 'font-semibold text-white' : 'text-zinc-400'}>
            Diagnostic Assessment
          </span>
        </div>
        <div className="h-[1px] w-12 bg-zinc-800" />
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step === 3 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            3
          </span>
          <span className={step === 3 ? 'font-semibold text-white' : 'text-zinc-400'}>
            Generated Plan
          </span>
        </div>
      </div>

      {/* STEP 1: Profile Setup */}
      {step === 1 && (
        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="text-xs">
                Step 1 of 3
              </Badge>
              <span className="text-xs text-zinc-400">Takes ~90 seconds</span>
            </div>
            <CardTitle className="text-xl">Tell us about your placement goals</CardTitle>
            <CardDescription>
              We use these constraints to calibrate your daily study schedule and role-specific readiness criteria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Chennai Institute of Technology"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Degree & Branch
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.E. Computer Science"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Current Year & Semester
                </label>
                <input
                  type="text"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  placeholder="e.g. 3rd Year (6th Sem)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                Target Career Path
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const isSelected = targetRole === r.id
                  return (
                    <div
                      key={r.id}
                      onClick={() => setTargetRole(r.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{r.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{r.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Preparation Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-900">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Self-Assessed Skill Level
                </label>
                <select
                  value={currentSkillLevel}
                  onChange={(e) => setCurrentSkillLevel(e.target.value as SkillLevel)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="beginner">Beginner (Building basics)</option>
                  <option value="intermediate">Intermediate (Solved 50+ DSA)</option>
                  <option value="advanced">Advanced (Contest rated, ready)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Available Study Hours/Day
                </label>
                <select
                  value={availableHoursPerDay}
                  onChange={(e) => setAvailableHoursPerDay(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>1.0 hour / day</option>
                  <option value={1.5}>1.5 hours / day</option>
                  <option value={2}>2.0 hours / day</option>
                  <option value={2.5}>2.5 hours / day (Recommended)</option>
                  <option value={3}>3.0 hours / day</option>
                  <option value={4}>4.0 hours / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Days until Placement
                </label>
                <input
                  type="number"
                  min={14}
                  max={365}
                  value={daysUntilPlacement}
                  onChange={(e) => setDaysUntilPlacement(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="glow"
                size="lg"
                onClick={() => setStep(2)}
                className="flex items-center gap-2"
              >
                Proceed to Diagnostic Assessment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Diagnostic Assessment */}
      {step === 2 && (
        <Card className="border-zinc-800 bg-zinc-950/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="cyan" className="text-xs">
                Question {currentQIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
              </Badge>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                Topic: {DIAGNOSTIC_QUESTIONS[currentQIndex].dimension.replace('_', ' ')}
              </span>
            </div>
            <CardTitle className="text-lg text-white mt-2">
              {DIAGNOSTIC_QUESTIONS[currentQIndex].prompt}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {DIAGNOSTIC_QUESTIONS[currentQIndex].options.map((opt) => {
                const q = DIAGNOSTIC_QUESTIONS[currentQIndex]
                const isSelected = selectedAnswers[q.id] === opt.id
                const isSubmitted = submittedAnswers[q.id]
                const isCorrect = opt.id === q.correctOptionId

                let optionStyles = 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                if (isSelected) {
                  optionStyles = 'border-indigo-500 bg-indigo-500/10 text-white'
                }
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                  } else if (isSelected) {
                    optionStyles = 'border-rose-500 bg-rose-500/10 text-rose-300'
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(q.id, opt.id)}
                    className={`w-full p-3.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${optionStyles}`}
                  >
                    <span>{opt.text}</span>
                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Answer Explanation & Feedback */}
            {submittedAnswers[DIAGNOSTIC_QUESTIONS[currentQIndex].id] && (
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="font-semibold text-zinc-200">Engineering Concept:</div>
                <p className="text-zinc-400 leading-relaxed">
                  {DIAGNOSTIC_QUESTIONS[currentQIndex].explanation}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Profile
              </Button>

              <div className="flex items-center gap-2">
                {!submittedAnswers[DIAGNOSTIC_QUESTIONS[currentQIndex].id] ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!selectedAnswers[DIAGNOSTIC_QUESTIONS[currentQIndex].id]}
                    onClick={handleConfirmAnswer}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5"
                  >
                    {currentQIndex < DIAGNOSTIC_QUESTIONS.length - 1 ? 'Next Question' : 'View Generated Plan'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Generated Plan Preview & Confirmation */}
      {step === 3 && (
        <Card className="border-indigo-500/30 bg-zinc-950/80">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl text-white">
              Placement Readiness Profile Calibrated!
            </CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Your profile for <strong className="text-zinc-200">{name}</strong> aiming for{' '}
              <strong className="text-indigo-300">{targetRole.replace('_', ' ')}</strong> has been processed by the Recommendation Engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
              <div className="font-semibold text-zinc-200">What the engine determined:</div>
              <p className="text-zinc-400 leading-relaxed">
                You have {daysUntilPlacement} days before placement drives start. Based on your {availableHoursPerDay} available hours per day, the engine will structure high-yield drills without overloading your schedule.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                variant="glow"
                size="lg"
                onClick={handleFinishOnboarding}
                className="px-8 h-12 text-sm font-semibold flex items-center gap-2"
              >
                Enter Personalized Placement Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

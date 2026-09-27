import React, { useState } from 'react'
import {
  MessageSquareCode,
  Sparkles,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STAR_QUESTIONS = [
  {
    id: 'star-1',
    category: 'Behavioral & Leadership',
    question: 'Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?',
    rubric: 'Evaluates empathy, reliance on benchmarks/data over ego, and constructive compromise.',
  },
  {
    id: 'star-2',
    category: 'Failure & Ownership',
    question: 'Describe a project where you failed or missed a critical deadline. What did you learn and how did you adapt?',
    rubric: 'Evaluates accountability, post-mortem methodology, and systemic prevention.',
  },
  {
    id: 'star-3',
    category: 'Technical Deep-Dive',
    question: 'Walk me through the hardest bug you ever encountered in production. How did you isolate root cause?',
    rubric: 'Evaluates scientific debugging process, logging, binary search of commit history, and prevention.',
  },
]

export const InterviewView: React.FC = () => {
  const [activeQ, setActiveQ] = useState(STAR_QUESTIONS[0])
  const [response, setResponse] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<{
    situationScore: number
    actionScore: number
    resultScore: number
    feedback: string
    keyImprovement: string
  } | null>(null)

  const handleEvaluate = () => {
    if (!response.trim()) return
    setIsEvaluating(true)
    setTimeout(() => {
      setIsEvaluating(false)
      setEvaluation({
        situationScore: 88,
        actionScore: 82,
        resultScore: 78,
        feedback:
          'Solid breakdown of the context and distinct technical tradeoffs. You maintained composure and emphasized objective metrics.',
        keyImprovement:
          'Quantify the final Result more aggressively: Mention percentage reduction in latency, lines saved, or team velocity increase.',
      })
    }, 1000)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-2.5">
            <MessageSquareCode className="w-3.5 h-3.5 text-white" />
            <span>Behavioral & System Design Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Interview Preparation & AI Evaluator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Rehearse behavioral STAR stories and technical communication rubrics with simulated interviewer scoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Questions selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 px-1">
            High-Frequency Behavioral Prompts
          </div>
          {STAR_QUESTIONS.map((q) => {
            const isSelected = activeQ.id === q.id
            return (
              <div
                key={q.id}
                onClick={() => {
                  setActiveQ(q)
                  setEvaluation(null)
                  setResponse('')
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-white/[0.3] bg-[#12131a] shadow-lg shadow-black/40'
                    : 'border-white/[0.06] bg-[#0c0d12]/80 hover:border-white/[0.14] hover:bg-[#0f1017]'
                }`}
              >
                <Badge variant="secondary" className="text-[10px] mb-1.5 font-mono uppercase bg-zinc-900 text-zinc-300 border-white/[0.06]">
                  {q.category}
                </Badge>
                <h4 className="text-xs font-semibold text-zinc-100 leading-snug">
                  {q.question}
                </h4>
              </div>
            )
          })}

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-xs space-y-2 mt-4 shadow-sm">
            <span className="font-semibold text-white block">The STAR Rubric:</span>
            <ul className="text-zinc-400 space-y-1.5 text-[11px] list-disc list-inside">
              <li><strong className="text-zinc-200">S</strong>ituation: 20s context</li>
              <li><strong className="text-zinc-200">T</strong>ask: 15s challenge</li>
              <li><strong className="text-zinc-200">A</strong>ction: 60s what YOU did</li>
              <li><strong className="text-zinc-200">R</strong>esult: 25s quantifiable metrics</li>
            </ul>
          </div>
        </div>

        {/* Right: Mock Evaluation Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-white/[0.08] bg-[#0c0d12]/90 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-white/[0.06]">
              <Badge variant="default" className="text-xs w-fit font-mono">
                {activeQ.category}
              </Badge>
              <CardTitle className="text-lg text-white mt-2 font-bold tracking-tight">
                {activeQ.question}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Rubric: {activeQ.rubric}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold text-zinc-200 mb-1.5 block">
                  Your Answer (Draft or Transcript):
                </label>
                <textarea
                  aria-label="Your Answer draft or transcript"
                  rows={7}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Structure your answer using STAR: In my 3rd semester project, our team had conflicting views on database schema... I proposed running a benchmark comparing query throughput... We documented the result and aligned..."
                  className="w-full bg-zinc-950/90 border border-white/[0.1] rounded-xl p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-white/[0.3] placeholder:text-zinc-600 transition-colors"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-zinc-400">
                  Target length: 150-250 words
                </span>
                <Button
                  size="sm"
                  variant="glow"
                  disabled={isEvaluating || !response.trim()}
                  onClick={handleEvaluate}
                  className="text-xs flex items-center gap-1.5 rounded-full px-4"
                >
                  {isEvaluating ? 'Evaluating STAR...' : 'Run Interview AI Evaluator'}
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>

              {evaluation && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.12] text-xs space-y-4 mt-4 animate-in fade-in shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-white" />
                      Interviewer Evaluation Feedback
                    </span>
                    <Badge variant="success" className="text-xs font-mono">
                      Strong Hire Potential
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Situation & Task</span>
                      <span className="text-base font-bold font-mono text-emerald-400">{evaluation.situationScore}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Personal Action</span>
                      <span className="text-base font-bold font-mono text-white">{evaluation.actionScore}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Quantified Result</span>
                      <span className="text-base font-bold font-mono text-amber-400">{evaluation.resultScore}%</span>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed">
                    {evaluation.feedback}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                    <strong className="text-amber-200">Key Improvement: </strong>
                    {evaluation.keyImprovement}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

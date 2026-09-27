import React, { useState } from 'react'
import {
  MessageSquareCode,
  Sparkles,
  Send,
  FileText,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0

  const handleEvaluate = () => {
    if (!response.trim() || isEvaluating) return
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

  const handleInsertTemplate = () => {
    const template = "Situation:\nIn my recent team project, we faced...\n\nTask:\nMy specific responsibility was to resolve...\n\nAction:\nI designed a benchmark suite to objectively test both implementations...\n\nResult:\nThe data proved our approach reduced query response time by 42% and saved 12 hours of debugging.\n"
    setResponse(template)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-border/60 text-zinc-300 text-xs font-medium mb-2.5">
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

        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-xs px-2.5 py-1">
            STAR Method Guided
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Questions selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 px-1">
            <span>High-Frequency Behavioral Prompts</span>
            <span className="font-mono text-[10px] text-zinc-500">{STAR_QUESTIONS.length} Prompts</span>
          </div>

          <div className="space-y-2.5">
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
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveQ(q)
                      setEvaluation(null)
                      setResponse('')
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    isSelected
                      ? 'border-border/90 bg-[#12131a] shadow-lg shadow-black/40'
                      : 'border-border/40 bg-[#0c0d12]/80 hover:border-border/80 hover:bg-[#0f1017]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <Badge variant="secondary" className="text-[9px] py-0 px-2 font-mono uppercase bg-zinc-900 text-zinc-300 border-border/40">
                      {q.category}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    {q.question}
                  </h4>
                </div>
              )
            })}
          </div>

          {/* Accordion: The STAR Rubric Explanation */}
          <Card className="border-border/60 bg-zinc-950/80">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-white font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                The STAR Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Accordion defaultValue={["item-1"]} className="w-full">
                <AccordionItem value="item-1" className="border-border/40">
                  <AccordionTrigger className="text-xs text-zinc-300 hover:text-white py-2">
                    STAR Dimension Breakdown
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-zinc-400 space-y-2 pt-1">
                    <div className="space-y-1.5">
                      <p><strong className="text-emerald-400 font-mono">S - Situation:</strong> Set the context and problem (~20s).</p>
                      <p><strong className="text-cyan-400 font-mono">T - Task:</strong> State the core challenge and goal (~15s).</p>
                      <p><strong className="text-indigo-400 font-mono">A - Action:</strong> What specific technical decisions YOU made (~60s).</p>
                      <p><strong className="text-amber-400 font-mono">R - Result:</strong> Quantifiable business outcome or metrics (~25s).</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right: Mock Evaluation Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/60 bg-[#0c0d12]/90 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-xs font-mono">
                  {activeQ.category}
                </Badge>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Behavioral Interview Simulator
                </span>
              </div>
              <CardTitle className="text-lg text-white mt-2 font-bold tracking-tight">
                {activeQ.question}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Rubric: {activeQ.rubric}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-200 block">
                    Your Answer (Draft or Transcript):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleInsertTemplate}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                      title="Insert standard STAR template"
                    >
                      <FileText className="w-3 h-3" />
                      STAR Scaffold
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={() => { setResponse(''); setEvaluation(null); }}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                      title="Clear answer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                </div>

                <Textarea
                  aria-label="Your Answer draft or transcript"
                  rows={8}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      handleEvaluate()
                    }
                  }}
                  placeholder="Structure your answer using STAR: In my 3rd semester project, our team had conflicting views on database schema... I proposed running a benchmark comparing query throughput... We documented the result and aligned..."
                  className="w-full bg-zinc-950/90 border border-border/70 rounded-xl p-3 text-xs text-zinc-100 font-mono focus-visible:ring-1 focus-visible:ring-white/30 placeholder:text-zinc-600 transition-colors leading-relaxed min-h-[160px]"
                />

                <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-1 px-1">
                  <span className={wordCount >= 100 && wordCount <= 350 ? 'text-emerald-400 font-medium' : 'text-zinc-400'}>
                    {wordCount} words • Target: 150-250 words
                  </span>
                  <span className="font-mono text-zinc-500 hidden sm:inline">⌘/Ctrl + Enter to evaluate</span>
                </div>
              </div>

              <div className="flex justify-end items-center pt-1">
                <Button
                  size="sm"
                  variant="glow"
                  disabled={isEvaluating || !response.trim()}
                  onClick={handleEvaluate}
                  className="text-xs flex items-center gap-1.5 rounded-full px-5"
                >
                  {isEvaluating ? 'Evaluating STAR...' : 'Run Interview AI Evaluator'}
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>

              {evaluation && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-border/80 text-xs space-y-4 mt-4 animate-in fade-in shadow-xl">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-white" />
                      Interviewer Evaluation Feedback
                    </span>
                    <Badge variant="success" className="text-xs font-mono">
                      Strong Hire Potential
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-border/50 space-y-1.5">
                      <span className="text-[10px] text-zinc-400 block">Situation & Task</span>
                      <span className="text-base font-bold font-mono text-emerald-400">{evaluation.situationScore}%</span>
                      <Progress value={evaluation.situationScore} indicatorClassName="bg-emerald-400" aria-label="Situation & Task score" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-border/50 space-y-1.5">
                      <span className="text-[10px] text-zinc-400 block">Personal Action</span>
                      <span className="text-base font-bold font-mono text-white">{evaluation.actionScore}%</span>
                      <Progress value={evaluation.actionScore} indicatorClassName="bg-white" aria-label="Personal Action score" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-border/50 space-y-1.5">
                      <span className="text-[10px] text-zinc-400 block">Quantified Result</span>
                      <span className="text-base font-bold font-mono text-amber-400">{evaluation.resultScore}%</span>
                      <Progress value={evaluation.resultScore} indicatorClassName="bg-amber-400" aria-label="Quantified Result score" />
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

import React, { useState } from 'react'
import {
  Library,
  ExternalLink,
  Search,
  Info,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { INITIAL_RESOURCES } from '@/data/resources'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const CATEGORY_TAGS = [
  { id: 'all', label: 'All Modules' },
  { id: 'dsa', label: 'DSA' },
  { id: 'cs_fundamentals', label: 'CS Fundamentals' },
  { id: 'sql', label: 'SQL' },
  { id: 'programming', label: 'Programming / OOP' },
  { id: 'aptitude', label: 'Aptitude' },
]

export const ResourcesView: React.FC = () => {
  const { completedResourceIds, toggleResourceCompletion } = usePlacementStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = INITIAL_RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      res.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = selectedSource === 'all' || res.source === selectedSource
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory
    return matchesSearch && matchesSource && matchesCategory
  })

  const renderDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Easy
          </span>
        )
      case 'Medium':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            Medium
          </span>
        )
      case 'Hard':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
            Hard
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium">
            {diff}
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-medium mb-2.5">
            <Library className="w-3.5 h-3.5 text-white" />
            <span>Accredited Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Normalized Resource Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Standardized placement curriculum referencing accredited open-source computer science resources.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{completedResourceIds.length} of {INITIAL_RESOURCES.length} Completed</span>
        </div>
      </div>

      {/* Attribution Alert Card */}
      <div className="p-4 rounded-2xl border border-white/[0.08] bg-zinc-950/80 text-xs text-zinc-300 flex items-start gap-3.5 shadow-sm">
        <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-semibold">Open Source Attribution & Compliance:</strong>
          <p className="text-zinc-400 leading-relaxed text-[11px]">
            Resources in this normalized schema reference open learning content from{' '}
            <strong className="text-zinc-200">freeCodeCamp</strong> (CC-BY-SA 4.0),{' '}
            <strong className="text-zinc-200">OSSU Computer Science</strong> (MIT License), and{' '}
            <strong className="text-zinc-200">takeUforward / Striver A2Z</strong>. PlacementOS structures metadata and links to source content rather than bundling entire repositories, adhering to license requirements and keeping the package lightweight (&lt; 10MB).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar (Linear / GitHub conventions) */}
      <div className="space-y-3">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedCategory(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                selectedCategory === tag.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              aria-label="Search resources"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics, skills (e.g. Sliding Window, Mutex, Normalization)..."
              className="w-full bg-zinc-950/90 border border-white/[0.1] rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.3] focus:ring-1 focus:ring-white/20 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 p-0.5 rounded text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500 hidden sm:block shrink-0" />
            <select
              aria-label="Filter by resource source"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-zinc-950/90 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-white/[0.3] focus:ring-1 focus:ring-white/20 transition-colors cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="Striver A2Z">Striver A2Z</option>
              <option value="OSSU">OSSU Computer Science</option>
              <option value="freeCodeCamp">freeCodeCamp</option>
              <option value="Curated Placement">Curated Placement</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span>Showing {filtered.length} of {INITIAL_RESOURCES.length} learning modules</span>
          {(searchTerm || selectedSource !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSource('all')
                setSelectedCategory('all')
              }}
              className="text-white hover:underline text-[11px] font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Resource Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/[0.1] rounded-2xl bg-zinc-950/40 space-y-3">
          <p className="text-sm font-medium text-zinc-200">No matching learning resources found</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search keywords or reset the source filter to view accredited placement materials.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedSource('all'); setSelectedCategory('all'); }}
            className="text-xs text-white hover:text-zinc-300 underline font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded px-1"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((res) => {
            const isDone = completedResourceIds.includes(res.id)
            return (
              <Card
                key={res.id}
                className={`border transition-all duration-200 flex flex-col justify-between ${
                  isDone
                    ? 'border-emerald-500/30 bg-[#0c1410]/70'
                    : 'border-white/[0.06] bg-[#0c0d12]/90 hover:border-white/[0.15] hover:bg-[#0f1017]'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <Badge variant="secondary" className="text-[9px] py-0 px-2 font-mono uppercase bg-zinc-900 text-zinc-300 border-white/[0.06]">
                      {res.category.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-400 font-mono text-[10px]">{res.estimatedMinutes}m</span>
                      {renderDifficultyBadge(res.difficulty)}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold text-white leading-snug">
                    {res.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mt-1">
                    {res.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Skills pills */}
                  <div className="flex flex-wrap gap-1">
                    {res.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-white/[0.06] text-[10px] text-zinc-400 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Source: <strong className="text-zinc-200">{res.source}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {res.sourceUrl && (
                        <a
                          href={res.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                          title="Open original source repository"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant={isDone ? 'outline' : 'secondary'}
                        onClick={() => toggleResourceCompletion(res.id)}
                        className={`text-xs h-7 px-3 rounded-full transition-all ${
                          isDone
                            ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            : 'bg-zinc-800 text-zinc-200 hover:text-white'
                        }`}
                      >
                        {isDone ? 'Completed ✓' : 'Mark Done'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

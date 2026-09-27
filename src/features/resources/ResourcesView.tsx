import React, { useState } from 'react'
import {
  Library,
  ExternalLink,
  Search,
  Info,
} from 'lucide-react'
import { usePlacementStore } from '@/store/usePlacementStore'
import { INITIAL_RESOURCES } from '@/data/resources'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const ResourcesView: React.FC = () => {
  const { completedResourceIds, toggleResourceCompletion } = usePlacementStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')

  const filtered = INITIAL_RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      res.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = selectedSource === 'all' || res.source === selectedSource
    return matchesSearch && matchesSource
  })

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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            aria-label="Search resources"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topics, skills (e.g. Sliding Window, Mutex, Normalization)..."
            className="w-full bg-zinc-950/90 border border-white/[0.1] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.3] transition-colors"
          />
        </div>

        <select
          aria-label="Filter by resource source"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="bg-zinc-950/90 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-white/[0.3] transition-colors cursor-pointer"
        >
          <option value="all">All Sources</option>
          <option value="Striver A2Z">Striver A2Z</option>
          <option value="OSSU">OSSU Computer Science</option>
          <option value="freeCodeCamp">freeCodeCamp</option>
          <option value="Curated Placement">Curated Placement</option>
        </select>
      </div>

      {/* Resource Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/[0.1] rounded-2xl bg-zinc-950/40 space-y-3">
          <p className="text-sm font-medium text-zinc-200">No matching learning resources found</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search keywords or reset the source filter to view accredited placement materials.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedSource('all'); }}
            className="text-xs text-white hover:text-zinc-300 underline font-semibold transition-colors"
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
                  <span className="text-zinc-400 font-mono text-[10px]">
                    {res.estimatedMinutes}m • {res.difficulty}
                  </span>
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
                  <span className="text-[11px] text-zinc-400">
                    Source: <strong className="text-zinc-200">{res.source}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {res.sourceUrl && (
                      <a
                        href={res.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
                        title="View Source Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant={isDone ? 'outline' : 'secondary'}
                      onClick={() => toggleResourceCompletion(res.id)}
                      className="text-xs h-7 px-3 rounded-full"
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

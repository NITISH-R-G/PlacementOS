import React, { useEffect, useRef, useState } from 'react'

interface MetricItem {
  icon: string
  target: number
  suffix: string
  decimals: number
  label: string
  delay: string
}

const METRICS: MetricItem[] = [
  {
    icon: '<',
    target: 10,
    suffix: '+',
    decimals: 0,
    label: 'Skill Dimensions',
    delay: '0.5s',
  },
  {
    icon: '%',
    target: 100,
    suffix: '%',
    decimals: 0,
    label: 'Personalized Focus',
    delay: '0.58s',
  },
  {
    icon: '*',
    target: 24,
    suffix: '/7',
    decimals: 0,
    label: 'Learn at Your Pace',
    delay: '0.66s',
  },
  {
    icon: '#',
    target: 1,
    suffix: '',
    decimals: 0,
    label: 'Unified Roadmap',
    delay: '0.74s',
  },
]

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

export const StatsFooter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasTriggered, setHasTriggered] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return true
    }
    return false
  })
  const [counts, setCounts] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return METRICS.map((m) => m.target)
    }
    return [0, 0, 0, 0]
  })

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasTriggered])

  useEffect(() => {
    if (!hasTriggered) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) {
      return
    }

    const cancelIds: number[] = []
    const startTimers: ReturnType<typeof setTimeout>[] = []

    METRICS.forEach((metric, i) => {
      const duration = 1500 + i * 80
      const startOffset = 480 + i * 90

      const timer = setTimeout(() => {
        let startTime: number | null = null

        const frame = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const elapsed = timestamp - startTime
          const progress = Math.min(1, elapsed / duration)
          const currentVal = easeOutCubic(progress) * metric.target

          setCounts((prev) => {
            const next = [...prev]
            next[i] = currentVal
            return next
          })

          if (progress < 1) {
            cancelIds[i] = requestAnimationFrame(frame)
          }
        }

        cancelIds[i] = requestAnimationFrame(frame)
      }, startOffset)

      startTimers.push(timer)
    })

    return () => {
      startTimers.forEach(clearTimeout)
      cancelIds.forEach(cancelAnimationFrame)
    }
  }, [hasTriggered])

  return (
    <footer ref={containerRef} className="stats-footer" aria-label="Placement Metrics">
      {METRICS.map((metric, i) => (
        <div
          key={metric.label}
          className="stat-item anim"
          style={{ '--d': metric.delay } as React.CSSProperties}
        >
          <div className="stat-metric-row">
            <span className="stat-icon" aria-hidden="true">
              {metric.icon}
            </span>
            <span className="stat-value">
              {counts[i].toFixed(metric.decimals)}
              {metric.suffix}
            </span>
          </div>
          <span className="stat-label">{metric.label}</span>
        </div>
      ))}
    </footer>
  )
}

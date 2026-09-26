import React from 'react'
import { TrustRow } from './TrustRow'

interface HeroProps {
  onStartOnboarding: () => void
}

export const Hero: React.FC<HeroProps> = ({ onStartOnboarding }) => {
  return (
    <main className="hero-container">
      {/* Trust row */}
      <TrustRow />

      {/* Main headline - two independent animating lines */}
      <h1 className="main-headline">
        <span className="headline-line">Prepare With</span>
        <span className="headline-line">Intelligence</span>
      </h1>

      {/* Subheading */}
      <p
        className="hero-subheading anim"
        style={{ '--d': '0.28s' } as React.CSSProperties}
      >
        Your skills. Your goals. Your placement roadmap.
        <br />
        Know what to learn, what to practice, and what to improve next.
      </p>

      {/* Primary CTA */}
      <button
        type="button"
        className="primary-cta-button"
        onClick={onStartOnboarding}
      >
        Build My Roadmap
      </button>
    </main>
  )
}

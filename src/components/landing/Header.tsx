import React, { useState } from 'react'
import { DesktopNavigation } from './DesktopNavigation'
import { MobileNavigation } from './MobileNavigation'

interface HeaderProps {
  activeItem?: string
  onNavigate: (item: string) => void
  onSignIn: () => void
}

export const Header: React.FC<HeaderProps> = ({
  activeItem = 'landing',
  onNavigate,
  onSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="landing-header">
        {/* Circular Logo Button */}
        <button
          type="button"
          className="logo-button"
          onClick={() => onNavigate('landing')}
          aria-label="PlacementOS Home"
        >
          <img
            src="/assets/logo.svg"
            width={52}
            height={52}
            alt="PlacementOS Mark"
          />
        </button>

        {/* Desktop Navigation Pill */}
        <DesktopNavigation activeItem={activeItem} onNavigate={onNavigate} />

        {/* Desktop Sign In Button */}
        <button
          type="button"
          className="sign-in-btn desktop-only"
          onClick={onSignIn}
        >
          Sign In
        </button>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`burger-btn ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className="burger-bar" />
          <span className="burger-bar" />
          <span className="burger-bar" />
        </button>
      </header>

      {/* Mobile Navigation Sheet */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        activeItem={activeItem}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={onNavigate}
        onSignIn={onSignIn}
      />
    </>
  )
}

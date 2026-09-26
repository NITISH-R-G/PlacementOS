import React, { useEffect } from 'react'

interface MobileNavigationProps {
  isOpen: boolean
  activeItem: string
  onClose: () => void
  onNavigate: (item: string) => void
  onSignIn: () => void
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  activeItem,
  onClose,
  onNavigate,
  onSignIn,
}) => {
  const items = [
    { id: 'landing', label: 'Home' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'practice', label: 'Practice' },
    { id: 'resources', label: 'Resources' },
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 720 && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="mobile-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Sheet */}
      <div
        className="mobile-menu-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <nav className="flex flex-col gap-1">
          {items.map((item, index) => {
            const isActive = activeItem === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          className="mobile-signin-btn"
          style={{ animationDelay: '0.2s' }}
          onClick={() => {
            onSignIn()
            onClose()
          }}
        >
          Sign In
        </button>
      </div>
    </>
  )
}

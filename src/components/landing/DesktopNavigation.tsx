import React from 'react'

interface DesktopNavigationProps {
  activeItem: string
  onNavigate: (item: string) => void
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  activeItem,
  onNavigate,
}) => {
  const items = [
    { id: 'landing', label: 'Home' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'practice', label: 'Practice' },
    { id: 'resources', label: 'Resources' },
  ]

  return (
    <nav className="nav-pill" aria-label="Main Navigation">
      {items.map((item) => {
        const isActive = activeItem === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

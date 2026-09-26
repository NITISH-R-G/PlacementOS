import React from 'react'

export const TrustRow: React.FC = () => {
  return (
    <div
      className="trust-row anim"
      style={{ '--d': '0.05s' } as React.CSSProperties}
    >
      {/* Avatar 1: Microsoft */}
      <div className="avatar-ring" title="Microsoft">
        <div className="avatar-inner">
          <i className="fa-brands fa-microsoft" aria-hidden="true" />
        </div>
      </div>

      {/* Avatar 2: Amazon */}
      <div className="avatar-ring" title="Amazon">
        <div className="avatar-inner">
          <i className="fa-brands fa-amazon" aria-hidden="true" />
        </div>
      </div>

      {/* Avatar 3: Google */}
      <div className="avatar-ring" title="Google">
        <div className="avatar-inner">
          <i className="fa-brands fa-google" aria-hidden="true" />
        </div>
      </div>

      {/* Trust pill */}
      <div className="trust-pill">
        <span>Built for the Next Generation of Engineers</span>
      </div>
    </div>
  )
}

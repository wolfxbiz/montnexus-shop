'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'mnx-wwu-banner-v1'

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '10px var(--gutter)',
        backgroundColor: 'rgba(106,158,120,0.09)',
        borderBottom: '1px solid rgba(106,158,120,0.18)',
        position: 'relative',
      }}
    >
      {/* Pulse dot */}
      <span
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          flexShrink: 0,
          animation: 'bnr-pulse 2.8s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes bnr-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.75); }
        }
      `}</style>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          letterSpacing: 'var(--tracking-wide)',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        Need a custom website, app or software?&nbsp;
        <Link
          href="/"
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-muted)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
        >
          Work with us&nbsp;→
        </Link>
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: 'var(--gutter)',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-tertiary)',
          fontSize: '1rem',
          lineHeight: 1,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
      >
        ✕
      </button>
    </div>
  )
}

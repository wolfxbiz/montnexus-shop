'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'

export function Nav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image
          src="/mnx-logo.png"
          alt="Montnexus"
          width={140}
          height={36}
          style={{ filter: 'brightness(0) invert(0.85)', objectFit: 'contain' }}
          priority
        />
      </Link>

      {/* Hamburger button - mobile only */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="nav-hamburger"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 'var(--space-2)',
          minWidth: 44,
          minHeight: 44,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round">
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Nav links */}
      <div className={`nav-links ${open ? 'nav-links-open' : ''}`} style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        <Link href="/bundles" onClick={() => setOpen(false)}>Browse</Link>
        <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
        <Link href="/showcase" onClick={() => setOpen(false)}>Showcase</Link>
        <Link href="/articles" onClick={() => setOpen(false)}>Articles</Link>
        <Link href="/creators" onClick={() => setOpen(false)}>Creators</Link>
        {user ? (
          <>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => { logout(); setOpen(false) }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}

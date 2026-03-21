'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'

export function Nav() {
  const { user, logout } = useAuth()

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
      <div className="nav-links" style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        <Link href="/bundles">Browse</Link>
        <Link href="/bundles?free=true">Free</Link>
        <Link href="/articles">Articles</Link>
        <Link href="/creators">Creators</Link>
        {user ? (
          <>
            <Link
              href="/dashboard"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}
            >
              Dashboard
            </Link>
            <button
              onClick={() => logout()}
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
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type Mode = 'password' | 'magic'

export default function LoginPage() {
  const { login, loginWithMagicLink } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithMagicLink(email)
      setMagicSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send magic link.')
    } finally {
      setLoading(false)
    }
  }

  function switchMode(m: Mode) {
    setMode(m)
    setError('')
    setMagicSent(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-base)',
      padding: 'var(--space-6)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--color-bg-raised)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'block', marginBottom: 'var(--space-8)' }}>
          <Image
            src="/mnx-logo.png"
            alt="Montnexus"
            width={180}
            height={48}
            style={{ filter: 'brightness(0) invert(0.85)', objectFit: 'contain' }}
            priority
          />
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Sign in
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-7)' }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--color-accent)' }}>Create one</Link>
        </p>

        {/* Mode toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--color-bg-overlay)',
          borderRadius: 'var(--radius-md)',
          padding: 4,
          marginBottom: 'var(--space-6)',
          gap: 4,
        }}>
          {(['password', 'magic'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                padding: '0.55rem 0',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                background: mode === m ? 'var(--color-bg-raised)' : 'transparent',
                color: mode === m ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              }}
            >
              {m === 'password' ? 'Password' : 'Magic Link'}
            </button>
          ))}
        </div>

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {magicSent ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-7) 0' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                  Check your inbox
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-loose)' }}>
                  We sent a magic link to<br />
                  <span style={{ color: 'var(--color-text-primary)' }}>{email}</span>
                </p>
              </div>
            ) : (
              <>
                <Input
                  label="Email"
                  id="email-magic"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
                {error && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>
                    {error}
                  </p>
                )}
                <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                  {loading ? 'Sending…' : 'Send Magic Link'}
                </Button>
              </>
            )}
          </form>
        )}
      </div>
    </main>
  )
}

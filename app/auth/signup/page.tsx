'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SignupPage() {
  const { signup, loginWithGoogle, loginWithApple } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signup(email, password, name)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try { await loginWithGoogle() } catch { setError('Could not sign up with Google.') }
  }

  async function handleApple() {
    setError('')
    try { await loginWithApple() } catch { setError('Could not sign up with Apple.') }
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

        {success ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
            {/* Checkmark icon */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-5)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
              fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)',
            }}>
              Check your email
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-7)',
            }}>
              We sent a confirmation link to<br />
              <span style={{ color: 'var(--color-text-primary)' }}>{email}</span>
              <br /><br />
              Click the link to activate your account, then sign in.
            </p>
            <Button href="/auth/login" variant="secondary">Back to sign in</Button>
          </div>
        ) : (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
            }}>
              Create account
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-7)' }}>
              Already have one?{' '}
              <Link href="/auth/login" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
            </p>

            {/* Social providers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <button onClick={handleGoogle} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
                width: '100%', padding: '12px 16px',
                background: 'var(--color-bg-overlay)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-wide)',
                transition: 'border-color var(--transition-fast)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button onClick={handleApple} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
                width: '100%', padding: '12px 16px',
                background: 'var(--color-bg-overlay)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-wide)',
                transition: 'border-color var(--transition-fast)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              margin: 'var(--space-6) 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
              }}>
                or sign up with email
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                label="Name"
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
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
                placeholder="Min. 8 characters"
                required
                autoComplete="new-password"
              />
              {error && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>
                  {error}
                </p>
              )}
              <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            {/* Terms */}
            <p style={{
              marginTop: 'var(--space-6)',
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              color: 'var(--color-text-tertiary)', lineHeight: 1.6,
              textAlign: 'center',
            }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

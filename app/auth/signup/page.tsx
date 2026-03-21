'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-5)' }}>
              Check your email
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
              Confirm your address
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-7)' }}>
              We sent a confirmation link to<br />
              <span style={{ color: 'var(--color-text-primary)' }}>{email}</span>
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
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Button } from './Button'
import type { ServiceTier } from '@/types'

interface TierTableProps {
  tiers: ServiceTier[]
  serviceSlug: string
}

export function TierTable({ tiers, serviceSlug }: TierTableProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null)
  const [brief, setBrief] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const ordered = ['basic', 'standard', 'premium'] as const
  const sortedTiers = ordered
    .map(name => tiers.find(t => t.name === name))
    .filter(Boolean) as ServiceTier[]

  function handleSelect(tier: ServiceTier) {
    if (!user) {
      router.push(`/auth/login?next=/services/${serviceSlug}`)
      return
    }
    setSelectedTier(tier)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedTier) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/services/${serviceSlug}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier_id: selectedTier.id, brief }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div style={{
        maxWidth: 480, margin: '0 auto', textAlign: 'center',
        padding: 'var(--space-10) var(--space-6)',
        background: 'var(--color-bg-overlay)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--color-accent-soft)', border: '1px solid var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-5)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
          Inquiry sent
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-6)' }}>
          The creator will review your brief and get back to you. You can track this in your dashboard.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button href="/dashboard" variant="primary">Go to dashboard</Button>
          <Button href="/services" variant="ghost">Browse more services</Button>
        </div>
      </div>
    )
  }

  // Order form modal
  if (selectedTier) {
    return (
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => { setSelectedTier(null); setError('') }}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)',
            marginBottom: 'var(--space-6)', padding: 0,
          }}
        >
          ← Back to tiers
        </button>

        {/* Selected tier summary */}
        <div style={{
          padding: 'var(--space-5)',
          background: 'var(--color-bg-overlay)',
          border: '1px solid var(--color-accent)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-6)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 4 }}>
              Selected tier
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
              {selectedTier.title}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              {selectedTier.delivery_time_days} day delivery · {selectedTier.revisions} revision{selectedTier.revisions !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>
            ${(selectedTier.price_cents / 100).toFixed(0)}
          </div>
        </div>

        {/* Brief form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <label style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)',
              marginBottom: 'var(--space-2)',
            }}>
              Describe your project <span style={{ color: 'var(--color-text-tertiary)' }}>(optional)</span>
            </label>
            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder="What do you need? Share any relevant details, references, or requirements..."
              rows={5}
              style={{
                width: '100%', padding: 'var(--space-4)',
                background: 'var(--color-bg-overlay)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-loose)',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" style={{ justifyContent: 'center' }}>
            {loading ? 'Sending inquiry...' : `Send inquiry · $${(selectedTier.price_cents / 100).toFixed(0)}`}
          </Button>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-tertiary)', textAlign: 'center', lineHeight: 1.6 }}>
            You won&apos;t be charged yet. The creator will confirm before any payment is taken.
          </p>
        </form>
      </div>
    )
  }

  // Default tier cards
  return (
    <div className="tier-table">
      {sortedTiers.map((tier, i) => (
        <div
          key={tier.id}
          className={`tier-card ${i === 1 ? 'tier-card-featured' : ''}`}
        >
          {i === 1 && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
              color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase', marginBottom: 'var(--space-4)',
            }}>
              Most popular
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase', marginBottom: 'var(--space-2)',
          }}>
            {tier.name}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
            {tier.title}
          </h3>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            ${(tier.price_cents / 100).toFixed(0)}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)' }}>
            {tier.delivery_time_days} day delivery &middot; {tier.revisions} revision{tier.revisions !== 1 ? 's' : ''}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-6)' }}>
            {tier.description}
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flex: 1 }}>
            {tier.features.map((f, fi) => (
              <li key={fi} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>+</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSelect(tier)}
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: i === 1 ? 'none' : '1px solid var(--color-border)',
              background: i === 1 ? 'var(--color-accent)' : 'transparent',
              color: i === 1 ? 'var(--color-bg-base)' : 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity var(--transition-fast)',
            }}
          >
            {user ? 'Select' : 'Sign in to hire'}
          </button>
        </div>
      ))}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to Supabase profile update or email service
    setSubmitted(true)
  }

  return (
    <section className="section-sm" style={{ background: 'var(--color-bg-base)' }}>
      <div className="container" style={{ maxWidth: 'var(--content-width)' }}>
        <div className="section-label">Stay in the loop</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
          New bundles, monthly
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-7)', lineHeight: 'var(--leading-loose)' }}>
          Get notified when new bundles drop. No spam — just new releases.
        </p>
        {submitted ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
            You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary">Subscribe</Button>
          </form>
        )}
      </div>
    </section>
  )
}

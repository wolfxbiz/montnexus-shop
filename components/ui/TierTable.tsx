import { Button } from './Button'
import type { ServiceTier } from '@/types'

interface TierTableProps {
  tiers: ServiceTier[]
  serviceSlug: string
}

export function TierTable({ tiers, serviceSlug }: TierTableProps) {
  const ordered = ['basic', 'standard', 'premium'] as const
  const sortedTiers = ordered
    .map(name => tiers.find(t => t.name === name))
    .filter(Boolean) as ServiceTier[]

  return (
    <div className="tier-table">
      {sortedTiers.map((tier, i) => (
        <div
          key={tier.id}
          className={`tier-card ${i === 1 ? 'tier-card-featured' : ''}`}
        >
          {i === 1 && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-accent)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-4)',
            }}>
              Most popular
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)',
          }}>
            {tier.name}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}>
            {tier.title}
          </h3>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            ${(tier.price_cents / 100).toFixed(0)}
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--space-5)',
          }}>
            {tier.delivery_time_days} day delivery &middot; {tier.revisions} revision{tier.revisions !== 1 ? 's' : ''}
          </p>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-loose)',
            marginBottom: 'var(--space-6)',
          }}>
            {tier.description}
          </p>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-6)',
            flex: 1,
          }}>
            {tier.features.map((f, fi) => (
              <li key={fi} style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start',
              }}>
                <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>+</span>
                {f}
              </li>
            ))}
          </ul>
          <Button
            href={`/auth/login?redirect=/services/${serviceSlug}`}
            variant={i === 1 ? 'primary' : 'secondary'}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Select
          </Button>
        </div>
      ))}
    </div>
  )
}

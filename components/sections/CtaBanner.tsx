import { Button } from '@/components/ui/Button'

export function CtaBanner() {
  return (
    <section style={{
      background: 'var(--color-bg-raised)',
      borderTop: '1px solid var(--color-border-muted)',
      borderBottom: '1px solid var(--color-border-muted)',
      padding: 'var(--space-10) var(--gutter)',
      textAlign: 'center',
    }}>
      <div className="container">
        <p className="section-label" style={{ justifyContent: 'center' }}>Start building today</p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-5)',
          lineHeight: 'var(--leading-tight)',
        }}>
          Everything you need<br />to ship faster
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto var(--space-8)', lineHeight: 'var(--leading-loose)' }}>
          From UI kits to production code templates — quality digital assets for designers and developers.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button href="/bundles" variant="primary">Browse all bundles</Button>
          <Button href="/bundles?free=true" variant="free">Free downloads →</Button>
        </div>
      </div>
    </section>
  )
}

import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="hero-bg-slate grain-overlay section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: 'var(--content-width)' }}>
          <p className="reveal" style={{ marginBottom: 'var(--space-5)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
            Digital bundles for creators
          </p>
          <h1 className="reveal" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, var(--text-4xl))',
            fontWeight: 400,
            lineHeight: 'var(--leading-tight)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
          }}>
            Curated tools for<br />designers and builders
          </h1>
          <p className="reveal" style={{
            fontSize: 'var(--text-lg)',
            color: '#8aab96',
            lineHeight: 'var(--leading-loose)',
            marginBottom: 'var(--space-8)',
            maxWidth: 540,
          }}>
            UI kits, code templates, icon packs, eBooks, and productivity templates — thoughtfully curated for frontend developers and indie creators.
          </p>
          <div className="reveal" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button href="/bundles" variant="primary">Browse bundles</Button>
            <Button href="/bundles?free=true" variant="secondary">Free downloads</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

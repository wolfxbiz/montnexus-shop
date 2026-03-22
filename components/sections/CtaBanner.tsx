import Link from 'next/link'

const CATEGORIES = ['UI Kits', 'Code Templates', 'Icon Packs', 'eBooks', 'Services', 'Illustration', 'Consulting', 'Writing', 'Motion Design', 'Dev Tools', 'Notion Templates', 'Brand Identity']

export function CtaBanner() {
  return (
    <section
      data-section-theme="purple"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 100%, rgba(148,110,178,0.14) 0%, transparent 60%),
          radial-gradient(ellipse 60% 60% at 10% 20%, rgba(118,86,148,0.09) 0%, transparent 50%),
          var(--color-bg-raised)
        `,
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-9) 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ maxWidth: 680 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', padding: '5px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border-strong)', background: 'var(--color-accent-soft)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
            Built for creators
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, var(--text-3xl))',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--leading-tight)',
          marginBottom: 'var(--space-5)',
        }}>
          Everything a creator needs,<br />in one place
        </h2>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-8)', maxWidth: 520, margin: '0 auto var(--space-8)' }}>
          Products to download. Services to hire. A community to share your work. Articles to learn from. One platform built for every stage of your creative career.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
          <Link href="/bundles" className="btn btn-primary">Browse products</Link>
          <Link href="/services" className="btn btn-secondary">Hire a creator</Link>
          <Link href="/dashboard/become-creator" className="btn btn-ghost">Become a creator →</Link>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.55 }}>
          {CATEGORIES.map(cat => (
            <span key={cat} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              letterSpacing: 'var(--tracking-wide)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-overlay)',
              whiteSpace: 'nowrap',
            }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

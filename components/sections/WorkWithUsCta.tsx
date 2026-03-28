import Link from 'next/link'

const CAPABILITIES = [
  'Websites & Landing Pages',
  'Web Applications',
  'Mobile Apps (iOS + Android)',
  'Desktop Software',
  'SaaS Platforms',
  'API & Integrations',
]

export function WorkWithUsCta() {
  return (
    <section
      style={{
        background: `
          radial-gradient(ellipse 70% 80% at 100% 50%, rgba(100,148,168,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 60% at 0% 60%, rgba(106,158,120,0.06) 0%, transparent 55%),
          var(--color-bg-raised)
        `,
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-9) 0',
        overflow: 'hidden',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)',
          alignItems: 'center',
        }}
      >
        {/* Left — copy */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-5)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border-strong)',
              background: 'var(--color-blue-soft)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--color-blue)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-blue)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
              }}
            >
              Custom Development
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 3.5vw, var(--text-2xl))',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.01em',
            }}
          >
            Need something built<br />from the ground up?
          </h2>

          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-loose)',
              marginBottom: 'var(--space-6)',
              maxWidth: '440px',
            }}
          >
            We design and build custom digital products — websites, web apps, mobile
            apps and desktop software. AI-assisted workflows mean faster delivery
            at competitive rates.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Link href="/work-with-us" className="btn btn-primary">
              Work with us
            </Link>
            <Link href="/work-with-us#services" className="btn btn-secondary">
              See pricing
            </Link>
          </div>
        </div>

        {/* Right — capability chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            paddingLeft: 'clamp(0px, 4vw, var(--space-8))',
          }}
        >
          {CAPABILITIES.map((cap) => (
            <span
              key={cap}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                letterSpacing: 'var(--tracking-wide)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-strong)',
                background: 'var(--color-bg-overlay)',
                whiteSpace: 'nowrap',
                transition: 'border-color var(--transition-base), color var(--transition-base)',
              }}
            >
              {cap}
            </span>
          ))}

          <Link
            href="/work-with-us"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-accent)',
              letterSpacing: 'var(--tracking-wide)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(106,158,120,0.3)',
              background: 'var(--color-accent-soft)',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'border-color var(--transition-base)',
            }}
          >
            + more →
          </Link>
        </div>
      </div>
    </section>
  )
}

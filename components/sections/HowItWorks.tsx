import Link from 'next/link'

const PILLARS = [
  {
    num: '01',
    title: 'Digital products',
    desc: 'Discover 75+ curated bundles — UI kits, code templates, icon packs, eBooks, and Notion templates. Claim free downloads instantly or buy at transparent prices.',
    href: '/bundles',
    cta: 'Browse products',
    accent: 'var(--color-accent)',
    accentSoft: 'var(--color-accent-soft)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Hire a creator',
    desc: 'Work directly with talented designers, developers, writers, and consultants. Browse service tiers, choose what fits your scope, and get production-ready results.',
    href: '/services',
    cta: 'Browse services',
    accent: 'var(--color-blue)',
    accentSoft: 'var(--color-blue-soft)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Community showcase',
    desc: 'A living gallery of work from designers, developers, and artists in the community. Get inspired, share your latest project, and build an audience around your craft.',
    href: '/showcase',
    cta: 'Explore showcase',
    accent: 'var(--color-sage)',
    accentSoft: 'var(--color-sage-soft)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Articles & guides',
    desc: 'Deep-dive articles written by working professionals — design systems, freelancing, development workflows, and business strategy from people who have actually shipped.',
    href: '/articles',
    cta: 'Read articles',
    accent: 'var(--color-accent)',
    accentSoft: 'var(--color-accent-soft)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section
      data-section-theme="blue"
      style={{
        background: 'var(--color-bg-raised)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-9) 0',
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div>
            <div className="section-label">Everything in one place</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))', fontWeight: 400, color: 'var(--color-text-primary)' }}>
              Four ways to create and grow
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {PILLARS.map(p => (
            <div
              key={p.num}
              style={{
                padding: 'var(--space-6)',
                background: 'var(--color-bg-overlay)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              {/* Icon + number row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: p.accentSoft,
                  border: `1px solid ${p.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: p.accent,
                  flexShrink: 0,
                }}>
                  {p.icon}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)' }}>
                  {p.num}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)' }}>
                {p.title}
              </h3>

              {/* Description */}
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-loose)', flex: 1 }}>
                {p.desc}
              </p>

              {/* CTA */}
              <Link
                href={p.href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: p.accent,
                  letterSpacing: 'var(--tracking-wide)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                {p.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

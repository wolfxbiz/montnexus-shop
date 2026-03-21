const steps = [
  { num: '01', title: 'Browse', desc: 'Explore curated bundles across UI kits, dev templates, icons, and more.' },
  { num: '02', title: 'Download or buy', desc: 'Claim free bundles instantly. Paid products unlock securely via Stripe.' },
  { num: '03', title: 'Build', desc: 'Use your assets immediately. All files are production-ready and well-documented.' },
]

export function HowItWorks() {
  return (
    <section
      className="section-sm"
      style={{
        background: 'var(--color-bg-raised)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div className="section-label">How it works</div>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-8)' }}
          className="reveal-group"
        >
          {steps.map(step => (
            <div key={step.num} style={{ padding: 'var(--space-6)', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', marginBottom: 'var(--space-4)' }}>
                {step.num}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', fontSize: 'var(--text-base)' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

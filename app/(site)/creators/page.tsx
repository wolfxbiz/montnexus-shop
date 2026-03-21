import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

const perks = [
  { num: '01', title: 'Sell your work', desc: 'Upload UI kits, code templates, icon sets, eBooks, or Notion templates. Set your price and start earning.' },
  { num: '02', title: 'Write & market', desc: 'Publish articles on Montnexus. Share them externally to drive traffic — every view is a potential customer.' },
  { num: '03', title: 'Keep most of it', desc: 'Competitive revenue share. Payouts via Stripe. No hidden fees or platform lock-in.' },
]

export default function CreatorsPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="hero-bg-slate section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <div style={{ maxWidth: 'var(--content-width)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-5)' }}>
                Creator programme
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, var(--text-3xl))', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-6)' }}>
                Sell your digital work.<br />Build your audience.
              </h1>
              <p style={{ fontSize: 'var(--text-lg)', color: '#8aab96', lineHeight: 'var(--leading-loose)', maxWidth: 520, marginBottom: 'var(--space-8)' }}>
                Montnexus is the marketplace for designers and developers selling curated digital assets. Join the creator programme, list your products, and write articles that drive traffic.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Button href="/auth/signup?creator=true" variant="primary">Become a creator</Button>
                <Button href="/bundles" variant="secondary">Browse marketplace</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section style={{ background: 'var(--color-bg-raised)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-9) 0' }}>
          <div className="container">
            <div className="section-label">Why Montnexus</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
              {perks.map(p => (
                <div key={p.num} style={{ padding: 'var(--space-6)', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', marginBottom: 'var(--space-4)' }}>{p.num}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{p.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', fontSize: 'var(--text-sm)' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: 'var(--space-10) 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 'var(--content-width)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
              Ready to start selling?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>It takes 5 minutes to set up your creator profile.</p>
            <Button href="/auth/signup?creator=true" variant="primary">Get started free</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

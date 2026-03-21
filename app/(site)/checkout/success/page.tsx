export const dynamic = 'force-dynamic'

import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export default function CheckoutSuccessPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="section" style={{ textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 'var(--content-width)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-5)' }}>
              Payment confirmed
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
              Download ready
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-8)' }}>
              Your receipt and download link have been sent to your email. You can also access all your downloads from your dashboard.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button href="/dashboard" variant="primary">Go to dashboard</Button>
              <Button href="/bundles" variant="secondary">Browse more</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

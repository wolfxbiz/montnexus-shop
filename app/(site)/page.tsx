export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ProductGrid } from '@/components/sections/ProductGrid'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Newsletter } from '@/components/sections/Newsletter'
import { mockProducts } from '@/lib/mock-products'
import Link from 'next/link'

export default function HomePage() {
  const featured = mockProducts.filter(p => p.published).slice(0, 3)
  const free = mockProducts.filter(p => p.is_free && p.published)

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProductGrid products={featured} label="Featured bundles" title="Popular this month" />
        <HowItWorks />
        <ProductGrid products={free} label="Free downloads" title="Grab for free" />
        <CtaBanner />

        {/* Creators CTA */}
        <section style={{ background: 'var(--color-bg-raised)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-9) 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 540 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                  Creator programme
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-4)' }}>
                  Sell your digital work on Montnexus
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
                  Join our creator community. Upload UI kits, code, templates, and more. Write articles to drive traffic to your products.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <Link href="/creators" className="btn btn-primary">Become a creator</Link>
                  <Link href="/creators" className="btn btn-ghost">Learn more →</Link>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { num: '01', label: 'Upload & sell' },
                  { num: '02', label: 'Write articles' },
                  { num: '03', label: 'Earn revenue' },
                ].map(item => (
                  <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)' }}>{item.num}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

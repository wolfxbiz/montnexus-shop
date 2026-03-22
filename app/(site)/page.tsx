export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ProductGrid } from '@/components/sections/ProductGrid'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Newsletter } from '@/components/sections/Newsletter'
import { ServiceGrid } from '@/components/sections/ServiceGrid'
import { ShowcaseFeed } from '@/components/sections/ShowcaseFeed'
import { mockProducts } from '@/lib/mock-products'
import { mockServices } from '@/lib/mock-services'
import { mockShowcase } from '@/lib/mock-showcase'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product, Service, ShowcasePost } from '@/types'

async function getHomeData() {
  try {
    const supabase = await createClient()
    const [productsRes, servicesRes, showcaseRes] = await Promise.all([
      supabase
        .from('products')
        .select('*, creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('services')
        .select('*, tiers:service_tiers(*), creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('showcase_posts')
        .select('*, media:showcase_media(*), creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6),
    ])

    const products = (productsRes.data && productsRes.data.length > 0)
      ? (productsRes.data as Product[])
      : mockProducts.filter(p => p.published)

    const services = (servicesRes.data && servicesRes.data.length > 0)
      ? (servicesRes.data as Service[])
      : mockServices.filter(s => s.published)

    const showcase = (showcaseRes.data && showcaseRes.data.length > 0)
      ? (showcaseRes.data as ShowcasePost[])
      : mockShowcase

    return { products, services, showcase }
  } catch {
    return {
      products: mockProducts.filter(p => p.published),
      services: mockServices.filter(s => s.published),
      showcase: mockShowcase,
    }
  }
}

export default async function HomePage() {
  const { products, services, showcase } = await getHomeData()
  const featured = products.filter(p => p.published).slice(0, 3)
  const free = products.filter(p => p.is_free && p.published)
  const featuredServices = services.slice(0, 3)
  const recentShowcase = showcase.slice(0, 6)

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProductGrid products={featured} label="Featured bundles" title="Popular this month" />
        <HowItWorks />
        <ServiceGrid services={featuredServices} label="Hire a creator" title="Featured services" />
        <ProductGrid products={free} label="Free downloads" title="Grab for free" />
        <ShowcaseFeed posts={recentShowcase} label="Community" title="Fresh work from creators" />
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
                  Join our creator community. Sell digital products, offer services, share your work in the showcase, and write articles to grow your audience.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <Link href="/creators" className="btn btn-primary">Become a creator</Link>
                  <Link href="/creators" className="btn btn-ghost">Learn more →</Link>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { num: '01', label: 'Upload & sell' },
                  { num: '02', label: 'Offer services' },
                  { num: '03', label: 'Share your work' },
                  { num: '04', label: 'Earn revenue' },
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

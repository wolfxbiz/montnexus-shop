import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { createClient } from '@/lib/supabase/server'
import { mockServices } from '@/lib/mock-services'
import type { Service, ServiceCategory } from '@/types'

const CATEGORIES: { label: string; value: ServiceCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Design', value: 'design' },
  { label: 'Dev', value: 'dev' },
  { label: 'Consulting', value: 'consulting' },
  { label: 'Writing', value: 'writing' },
  { label: 'Audio / Video', value: 'audio-video' },
]

async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*, tiers:service_tiers(*), creator:creators(id, username, display_name, avatar_url)')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error || !data?.length) return mockServices
    return data as Service[]
  } catch {
    return mockServices
  }
}

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-9) 0 var(--space-6)' }}>
          <div className="container">
            <div className="section-label">Hire a creator</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, var(--text-3xl))', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
              Services
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
              Work directly with talented artists and developers.
            </p>
            {/* Category filter pills (static — full category pages would need client component) */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
              {CATEGORIES.map(cat => (
                <a
                  key={cat.value}
                  href={cat.value === 'all' ? '/services' : `/services?category=${cat.value}`}
                  className="tag tag-default"
                  style={{ textDecoration: 'none' }}
                >
                  {cat.label}
                </a>
              ))}
            </div>
            <div className="product-grid">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
              {services.length === 0 && (
                <p style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                  No services found.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

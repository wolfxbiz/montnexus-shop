import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Tag } from '@/components/ui/Tag'
import { TierTable } from '@/components/ui/TierTable'
import { createClient } from '@/lib/supabase/server'
import { mockServices } from '@/lib/mock-services'
import type { Service } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getService(slug: string): Promise<Service | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('services')
      .select('*, tiers:service_tiers(*), creator:creators(id, username, display_name, avatar_url, bio, twitter, website)')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (data) return data as Service
  } catch { /* fall through to mock */ }
  return mockServices.find(s => s.slug === slug && s.published) ?? null
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-9) 0' }}>
          <div className="container">
            <div className="two-col" style={{ gap: 'var(--space-8)' }}>
              {/* Cover */}
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)' }}>
                {service.cover_url && (
                  <Image src={service.cover_url} alt={service.title} fill style={{ objectFit: 'cover' }} />
                )}
              </div>
              {/* Info */}
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                  <Tag variant="sage">Service</Tag>
                  <Tag variant="default">{service.category}</Tag>
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, var(--text-3xl))', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-5)' }}>
                  {service.title}
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-lg)' }}>
                  {service.description}
                </p>
                {service.creator && (
                  <Link
                    href={`/creators/${service.creator.username}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                      {service.creator.avatar_url
                        ? <Image src={service.creator.avatar_url} alt={service.creator.display_name} width={36} height={36} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                        : <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            {service.creator.display_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                      }
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-wide)' }}>
                        {service.creator.display_name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        @{service.creator.username}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        {service.tiers && service.tiers.length > 0 && (
          <section style={{ background: 'var(--color-bg-raised)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-9) 0' }}>
            <div className="container">
              <div className="section-label">Choose a tier</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>
                Pricing
              </h2>
              <TierTable tiers={service.tiers} serviceSlug={service.slug} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return mockServices.filter(s => s.published).map(s => ({ slug: s.slug }))
}

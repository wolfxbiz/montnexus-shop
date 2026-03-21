export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Card } from '@/components/ui/Card'
import { createServiceClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ username: string }> }

export default async function CreatorPage({ params }: Props) {
  const { username } = await params
  const supabase = await createServiceClient()

  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('username', username)
    .single()

  if (!creator) notFound()

  const [{ data: products }, { data: articles }] = await Promise.all([
    supabase.from('products').select('id, title, slug, description, short_desc, cover_url, price_cents, is_free, category, file_count, published, created_at').eq('creator_id', creator.id).eq('published', true),
    supabase.from('articles').select('id, title, slug, excerpt, cover_url, published_at').eq('creator_id', creator.id).eq('published', true).order('published_at', { ascending: false }),
  ])

  const initials = creator.display_name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>

        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(180deg, var(--color-bg-raised) 0%, var(--color-bg-base) 100%)', borderBottom: '1px solid var(--color-border-muted)', paddingBottom: 0 }}>
          <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 0 }}>

            {/* Avatar + name row */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--color-bg-overlay)', overflow: 'hidden', border: '2px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {creator.avatar_url
                  ? <Image src={creator.avatar_url} alt={creator.display_name} width={96} height={96} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  : <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text-secondary)' }}>{initials}</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 'var(--space-2)' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                  {creator.display_name}
                </h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)' }}>
                  @{creator.username}
                </p>
              </div>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 'var(--space-6)', paddingBottom: 'var(--space-2)' }}>
                {[{ label: 'Products', value: products?.length ?? 0 }, { label: 'Articles', value: articles?.length ?? 0 }].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio + links */}
            <div style={{ maxWidth: 620, paddingBottom: 'var(--space-8)' }}>
              {creator.bio && (
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                  {creator.bio}
                </p>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                {creator.website && (
                  <a href={creator.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🌐 {creator.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {creator.twitter && (
                  <a href={`https://twitter.com/${creator.twitter}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    𝕏 @{creator.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        {products && products.length > 0 && (
          <section style={{ padding: 'var(--space-10) 0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <div className="section-label" style={{ margin: 0 }}>Products</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{products.length} item{products.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="product-grid">
                {products.map(p => <Card key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* Articles */}
        {articles && articles.length > 0 && (
          <section style={{ padding: 'var(--space-10) 0', borderTop: products?.length ? '1px solid var(--color-border-muted)' : 'none' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                <div className="section-label" style={{ margin: 0 }}>Articles</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{articles.length} post{articles.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
                {articles.map(a => (
                  <Link key={a.id} href={`/articles/${a.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'border-color var(--transition-fast)' }}>
                    {a.cover_url && (
                      <div style={{ height: 160, overflow: 'hidden' }}>
                        <img src={a.cover_url} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: 'var(--space-5)', flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{a.title}</h3>
                      {a.excerpt && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-4)' }}>{a.excerpt}</p>}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                        {a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {(!products || products.length === 0) && (!articles || articles.length === 0) && (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>No content published yet</p>
          </div>
        )}

      </main>
    </>
  )
}

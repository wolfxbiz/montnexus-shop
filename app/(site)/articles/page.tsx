export const dynamic = 'force-dynamic'

import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { mockArticles } from '@/lib/mock-articles'
import type { Article } from '@/types'

async function getArticles(): Promise<Article[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*, creator:creators(id, username, display_name, avatar_url)')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (error || !data || data.length === 0) return mockArticles
    return data as Article[]
  } catch {
    return mockArticles
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <>
      <Nav />
      <main>
        {/* Page header */}
        <section style={{ padding: 'var(--space-9) 0 var(--space-7)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <div className="section-label">From creators</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, var(--text-3xl))',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-3)',
            }}>
              Articles & Guides
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 540 }}>
              Deep-dive articles from designers, developers, and creators in the community.
            </p>
          </div>
        </section>

        {/* Article grid */}
        <section style={{ padding: 'var(--space-8) 0' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--space-5)',
              }}
              className="articles-feed-grid"
            >
              {articles.map(article => (
                <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                  <article
                    style={{
                      background: 'var(--color-bg-raised)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'border-color var(--transition-fast)',
                    }}
                    className="article-card"
                  >
                    {/* Cover */}
                    <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--color-bg-overlay)', flexShrink: 0 }}>
                      {article.cover_url ? (
                        <Image
                          src={article.cover_url}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-bg-overlay))',
                        }} />
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--color-text-tertiary)',
                        letterSpacing: 'var(--tracking-wide)',
                      }}>
                        {article.creator && <span>{article.creator.display_name}</span>}
                        {article.creator && <span style={{ opacity: 0.4 }}>·</span>}
                        <span>{formatDate(article.published_at)}</span>
                      </div>

                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 400,
                        color: 'var(--color-text-primary)',
                        lineHeight: 'var(--leading-tight)',
                        flex: 1,
                      }}>
                        {article.title}
                      </h2>

                      <p style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 'var(--leading-normal)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {article.excerpt}
                      </p>

                      <div style={{
                        marginTop: 'var(--space-2)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--color-accent)',
                        letterSpacing: 'var(--tracking-wide)',
                      }}>
                        Read article →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

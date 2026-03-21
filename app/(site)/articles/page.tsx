import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

async function getArticles() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('*, creator:creators(username, display_name, avatar_url)')
      .eq('published', true)
      .order('published_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-9) 0 var(--space-6)' }}>
          <div className="container">
            <div className="section-label">From creators</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
              Articles & Guides
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-9)' }}>
              Insights from the Montnexus creator community.
            </p>

            {articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', borderTop: '1px solid var(--color-border-muted)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                  No articles yet — check back soon
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
                {articles.map((article: { id: string; slug: string; cover_url: string | null; title: string; excerpt: string; published_at: string; creator: { username: string; display_name: string } }) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                    <article className="card" style={{ height: '100%' }}>
                      <div className="card-cover">
                        {article.cover_url
                          ? <Image src={article.cover_url} alt={article.title} fill style={{ objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: 'var(--color-bg-overlay)' }} />
                        }
                      </div>
                      <div className="card-body">
                        <div className="card-category">{article.creator?.display_name}</div>
                        <h2 className="card-title">{article.title}</h2>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
                          {article.excerpt}
                        </p>
                        <div className="card-footer" style={{ marginTop: 'var(--space-4)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                            {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

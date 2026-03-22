import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/types'

interface Props {
  articles: Article[]
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ArticlesFeed({ articles }: Props) {
  if (!articles || articles.length === 0) return null
  const items = articles.slice(0, 6)

  return (
    <section
      style={{
        background: 'var(--color-bg-raised)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-9) 0',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
        }}>
          <div>
            <div className="section-label">From creators</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
            }}>
              Articles & Guides
            </h2>
          </div>
          <Link
            href="/articles"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              letterSpacing: 'var(--tracking-wide)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            All articles →
          </Link>
        </div>

        {/* Card grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-5)',
          }}
          className="articles-feed-grid"
        >
          {items.map(article => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
            >
              <article
                style={{
                  background: 'var(--color-bg-overlay)',
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
                <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--color-bg-base)', flexShrink: 0 }}>
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
                  {/* Meta */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: 'var(--tracking-wide)',
                  }}>
                    {article.creator && (
                      <>
                        <span>{article.creator.display_name}</span>
                        <span style={{ opacity: 0.4 }}>·</span>
                      </>
                    )}
                    <span>{formatDate(article.published_at)}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 400,
                    color: 'var(--color-text-primary)',
                    lineHeight: 'var(--leading-tight)',
                    flex: 1,
                  }}>
                    {article.title}
                  </h3>

                  {/* Excerpt */}
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

                  {/* Read link */}
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
  )
}

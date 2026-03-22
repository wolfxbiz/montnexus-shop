import Link from 'next/link'
import { ShowcaseItem } from '@/components/ui/ShowcaseItem'
import type { ShowcasePost } from '@/types'

interface ShowcaseFeedProps {
  posts: ShowcasePost[]
  title?: string
  label?: string
  viewAllHref?: string
}

export function ShowcaseFeed({ posts, title, label, viewAllHref }: ShowcaseFeedProps) {
  return (
    <section style={{ padding: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        {(label || title || viewAllHref) && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-7)', flexWrap: 'wrap' }}>
            <div>
              {label && <div className="section-label">{label}</div>}
              {title && (
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {title}
                </h2>
              )}
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                View all →
              </Link>
            )}
          </div>
        )}
        <div className="masonry-grid">
          {posts.map(post => (
            <ShowcaseItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

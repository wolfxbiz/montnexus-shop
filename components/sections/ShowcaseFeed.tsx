import { ShowcaseItem } from '@/components/ui/ShowcaseItem'
import type { ShowcasePost } from '@/types'

interface ShowcaseFeedProps {
  posts: ShowcasePost[]
  title?: string
  label?: string
}

export function ShowcaseFeed({ posts, title, label }: ShowcaseFeedProps) {
  return (
    <section className="section">
      <div className="container">
        {label && <div className="section-label">{label}</div>}
        {title && (
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-8)',
          }}>
            {title}
          </h2>
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

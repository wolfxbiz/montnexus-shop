import Link from 'next/link'
import Image from 'next/image'
import type { ShowcasePost } from '@/types'

interface ShowcaseItemProps {
  post: ShowcasePost
}

export function ShowcaseItem({ post }: ShowcaseItemProps) {
  const media = post.media?.[0]
  if (!media) return null

  return (
    <Link href={`/showcase/${post.id}`} className="showcase-item" style={{ textDecoration: 'none', display: 'block', breakInside: 'avoid', marginBottom: 'var(--space-4)' }}>
      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', transition: 'border-color var(--transition-base), transform var(--transition-slow)' }}>
        <Image
          src={media.media_url}
          alt={post.caption || 'Showcase'}
          width={media.width}
          height={media.height}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {/* Hover overlay */}
        <div className="showcase-overlay">
          <div style={{ padding: 'var(--space-4)' }}>
            {post.creator && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#fff', letterSpacing: 'var(--tracking-wide)', marginBottom: 'var(--space-2)', opacity: 0.9 }}>
                {post.creator.display_name}
              </div>
            )}
            {post.caption && (
              <p style={{ fontSize: 'var(--text-sm)', color: '#fff', lineHeight: 'var(--leading-normal)', opacity: 0.85, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.caption}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#fff', opacity: 0.7 }}>
                {post.like_count ?? 0} likes
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

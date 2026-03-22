import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { LikeButton } from '@/components/ui/LikeButton'
import { Tag } from '@/components/ui/Tag'
import { createClient } from '@/lib/supabase/server'
import { mockShowcase } from '@/lib/mock-showcase'
import type { ShowcasePost } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

async function getPost(id: string): Promise<ShowcasePost | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('showcase_posts')
      .select('*, media:showcase_media(*), creator:creators(id, username, display_name, avatar_url)')
      .eq('id', id)
      .eq('published', true)
      .single()

    if (!data) return mockShowcase.find(p => p.id === id) ?? null

    const { count } = await supabase
      .from('showcase_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)

    return { ...data, like_count: count || 0, liked_by_user: false } as ShowcasePost
  } catch {
    return mockShowcase.find(p => p.id === id) ?? null
  }
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  const media = post.media?.[0]

  return (
    <>
      <Nav />
      <main style={{ minHeight: '80vh' }}>
        <section style={{ padding: 'var(--space-9) 0' }}>
          <div className="container" style={{ maxWidth: 'var(--content-width)' }}>
            {/* Back link */}
            <Link href="/showcase" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-6)' }}>
              ← Showcase
            </Link>

            {/* Creator info */}
            {post.creator && (
              <Link
                href={`/creators/${post.creator.username}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none', marginBottom: 'var(--space-6)' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-bg-overlay)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {post.creator.avatar_url
                    ? <Image src={post.creator.avatar_url} alt={post.creator.display_name} width={40} height={40} style={{ objectFit: 'cover' }} />
                    : <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        {post.creator.display_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                  }
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-wide)' }}>
                    {post.creator.display_name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    {timeAgo(post.created_at)}
                  </div>
                </div>
              </Link>
            )}

            {/* Image */}
            {media && (
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', marginBottom: 'var(--space-6)' }}>
                <Image
                  src={media.media_url}
                  alt={post.caption || 'Showcase'}
                  width={media.width || 800}
                  height={media.height || 600}
                  sizes="(max-width: 768px) 100vw, 720px"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  priority
                />
              </div>
            )}

            {/* Like + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-muted)', paddingBottom: 'var(--space-4)' }}>
              <LikeButton
                postId={post.id}
                initialLiked={post.liked_by_user ?? false}
                initialCount={post.like_count ?? 0}
              />
            </div>

            {/* Caption */}
            {post.caption && (
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
                {post.caption}
              </p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <Link key={tag} href={`/showcase?tag=${encodeURIComponent(tag)}`} style={{ textDecoration: 'none' }}>
                    <Tag variant="default">{tag}</Tag>
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export async function generateStaticParams() {
  return mockShowcase.map(p => ({ id: p.id }))
}

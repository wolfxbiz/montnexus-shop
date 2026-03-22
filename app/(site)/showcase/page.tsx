import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ShowcaseItem } from '@/components/ui/ShowcaseItem'
import { createClient } from '@/lib/supabase/server'
import { mockShowcase } from '@/lib/mock-showcase'
import type { ShowcasePost } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ tag?: string }>
}

async function getPosts(tag?: string): Promise<ShowcasePost[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('showcase_posts')
      .select('*, media:showcase_media(*), creator:creators(id, username, display_name, avatar_url)')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(40)

    if (tag) query = query.contains('tags', [tag])

    const { data, error } = await query
    if (error || !data?.length) return mockShowcase
    return data as ShowcasePost[]
  } catch {
    return mockShowcase
  }
}

async function getAllTags(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('showcase_posts')
      .select('tags')
      .eq('published', true)
    if (!data?.length) return Array.from(new Set(mockShowcase.flatMap(p => p.tags)))
    return Array.from(new Set(data.flatMap(p => p.tags as string[])))
  } catch {
    return Array.from(new Set(mockShowcase.flatMap(p => p.tags)))
  }
}

export default async function ShowcasePage({ searchParams }: Props) {
  const { tag: activeTag } = await searchParams
  const [posts, allTags] = await Promise.all([getPosts(activeTag), getAllTags()])

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-9) 0 var(--space-6)' }}>
          <div className="container">
            <div className="section-label">Community</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, var(--text-3xl))', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
              Showcase
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
              Fresh work from artists and developers in the community.
            </p>
            {/* Tag filters */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
              <a
                href="/showcase"
                className={`tag ${!activeTag ? 'tag-accent' : 'tag-default'}`}
                style={{ textDecoration: 'none' }}
              >
                All
              </a>
              {allTags.map(tag => (
                <a
                  key={tag}
                  href={`/showcase?tag=${encodeURIComponent(tag)}`}
                  className={`tag ${activeTag === tag ? 'tag-accent' : 'tag-default'}`}
                  style={{ textDecoration: 'none' }}
                >
                  {tag}
                </a>
              ))}
            </div>
            <div className="masonry-grid">
              {posts.map(post => <ShowcaseItem key={post.id} post={post} />)}
              {posts.length === 0 && (
                <p style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                  No posts found.
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

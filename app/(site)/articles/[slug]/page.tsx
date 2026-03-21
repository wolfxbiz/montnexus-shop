export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ slug: string }> }

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*, creator:creators(id, username, display_name, avatar_url, bio, twitter, website)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) notFound()

  return (
    <>
      <Nav />
      <main>
        <article>
          {article.cover_url && (
            <div style={{ position: 'relative', height: '45vh', minHeight: 320, background: 'var(--color-bg-raised)' }}>
              <Image src={article.cover_url} alt={article.title} fill style={{ objectFit: 'cover', opacity: 0.7 }} />
            </div>
          )}
          <div className="container" style={{ maxWidth: 'var(--content-width)', padding: 'var(--space-9) var(--gutter)' }}>
            <div style={{ marginBottom: 'var(--space-7)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Article'}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-6)' }}>
                {article.title}
              </h1>
              {article.creator && (
                <Link href={`/creators/${article.creator.username}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg-overlay)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    {article.creator.avatar_url && (
                      <Image src={article.creator.avatar_url} alt={article.creator.display_name} width={36} height={36} style={{ objectFit: 'cover' }} />
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)' }}>
                    {article.creator.display_name}
                  </span>
                </Link>
              )}
            </div>
            <div style={{ borderTop: '1px solid var(--color-border-muted)', paddingTop: 'var(--space-7)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', whiteSpace: 'pre-wrap' }}>
              {article.content}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}

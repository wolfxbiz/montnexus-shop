'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function NewArticlePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '' })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const coverRef = useRef<HTMLInputElement>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    if (k === 'title' && !form.slug) {
      const autoSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setForm(f => ({ ...f, title: value, slug: autoSlug }))
    } else {
      setForm(f => ({ ...f, [k]: value }))
    }
  }

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setCoverFile(file)
    if (file) setCoverPreview(URL.createObjectURL(file))
    else setCoverPreview(null)
  }

  async function handleSubmit(e: React.MouseEvent, publish: boolean) {
    e.preventDefault()
    if (!form.title || !form.content) { setError('Title and content are required.'); return }
    if (!user) { setError('Not logged in.'); return }
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()

      const { data: creator } = await supabase.from('creators').select('id').eq('user_id', user.id).single()
      if (!creator) throw new Error('Creator profile required. Please create one first.')

      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      let cover_url = ''
      if (coverFile) {
        setStatus('Uploading cover image…')
        const ext = coverFile.name.split('.').pop()
        const path = `articles/${creator.id}/${slug}/cover.${ext}`
        const { error: uploadErr } = await supabase.storage.from('Products').upload(path, coverFile, { upsert: true })
        if (uploadErr) throw new Error(`Cover upload failed: ${uploadErr.message}`)
        const { data: pub } = supabase.storage.from('Products').getPublicUrl(path)
        cover_url = pub.publicUrl
      }

      setStatus('Saving article…')
      const { error: insertErr } = await supabase.from('articles').insert({
        creator_id: creator.id,
        title: form.title,
        slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_url,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      })
      if (insertErr) throw new Error(insertErr.message)

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save article.')
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--space-9) 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <Button href="/dashboard" variant="ghost" style={{ marginBottom: 'var(--space-6)' }}>← Back</Button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>New article</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>Write an article</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Input label="Title" id="title" value={form.title} onChange={set('title')} required placeholder="Your article title" />
            <Input label="Slug (auto-generated from title)" id="slug" value={form.slug} onChange={set('slug')} placeholder="your-article-slug" />
            <Input label="Excerpt (shown in listings)" id="excerpt" value={form.excerpt} onChange={set('excerpt')} placeholder="A short summary..." />

            {/* Cover image upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Cover image (optional)</label>
              {coverPreview && (
                <img src={coverPreview} alt="Cover preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)' }} />
              )}
              <div
                onClick={() => coverRef.current?.click()}
                style={{ padding: 'var(--space-5)', border: '2px dashed var(--color-border-muted)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: coverFile ? 'var(--color-bg-raised)' : 'transparent' }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: coverFile ? 'var(--color-accent)' : 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                  {coverFile ? `✓ ${coverFile.name}` : 'Click to upload cover image (.png, .jpg, .webp)'}
                </p>
              </div>
              <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onCoverChange} />
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Content</label>
              <textarea
                value={form.content}
                onChange={set('content')}
                rows={16}
                className="input"
                placeholder="Write your article here..."
                required
                style={{ resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 'var(--leading-loose)' }}
              />
            </div>

            {status && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>{status}</p>}
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={e => handleSubmit(e as unknown as React.MouseEvent, false)} disabled={loading}>
                Save draft
              </Button>
              <Button variant="primary" onClick={e => handleSubmit(e as unknown as React.MouseEvent, true)} disabled={loading}>
                {loading ? status || 'Saving…' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

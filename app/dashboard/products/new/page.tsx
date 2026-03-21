'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['design', 'dev', 'ebook', 'template', 'icon']

export default function NewProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '', slug: '', description: '', short_desc: '',
    category: 'design', price_cents: 0, file_count: 1,
  })
  const [productFile, setProductFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const productFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    if (k === 'title' && !form.slug) {
      const autoSlug = (value as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setForm(f => ({ ...f, title: value as string, slug: autoSlug }))
    } else {
      setForm(f => ({ ...f, [k]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!productFile) { setError('Please upload the product file.'); return }
    if (!user) { setError('Not logged in.'); return }
    setLoading(true)
    try {
      const supabase = createClient()

      // Get creator profile
      const { data: creator } = await supabase.from('creators').select('id').eq('user_id', user.id).single()
      if (!creator) throw new Error('Creator profile required. Please create one first.')

      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      // Upload product file
      setUploadProgress('Uploading product file…')
      const ext = productFile.name.split('.').pop()
      const filePath = `${creator.id}/${slug}/file.${ext}`
      const { error: uploadErr } = await supabase.storage.from('Products').upload(filePath, productFile, { upsert: true })
      if (uploadErr) throw new Error(`File upload failed: ${uploadErr.message}`)

      // Upload cover image (optional)
      let coverUrl = ''
      if (coverFile) {
        setUploadProgress('Uploading cover image…')
        const coverExt = coverFile.name.split('.').pop()
        const coverPath = `${creator.id}/${slug}/cover.${coverExt}`
        const { error: coverErr } = await supabase.storage.from('Products').upload(coverPath, coverFile, { upsert: true })
        if (!coverErr) {
          const { data: publicData } = supabase.storage.from('Products').getPublicUrl(coverPath)
          coverUrl = publicData.publicUrl
        }
      }

      setUploadProgress('Saving product…')
      const { error: insertErr } = await supabase.from('products').insert({
        title: form.title,
        slug,
        description: form.description,
        short_desc: form.short_desc,
        category: form.category,
        price_cents: form.price_cents,
        cover_url: coverUrl,
        file_path: filePath,
        file_count: form.file_count,
        creator_id: creator.id,
        published: false,
      })
      if (insertErr) throw new Error(insertErr.message)

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not submit product.')
    } finally {
      setLoading(false)
      setUploadProgress('')
    }
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--space-9) 0' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <Button href="/dashboard" variant="ghost" style={{ marginBottom: 'var(--space-6)' }}>← Back</Button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>New product</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>Submit a product</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Input label="Product title" id="title" value={form.title} onChange={set('title')} required placeholder="e.g. Dark UI Kit" />
            <Input label="Slug (auto-generated from title)" id="slug" value={form.slug} onChange={set('slug')} placeholder="dark-ui-kit" />
            <Input label="Short description (max 120 chars)" id="short_desc" value={form.short_desc} onChange={set('short_desc')} maxLength={120} required placeholder="One-line card description" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Full description</label>
              <textarea value={form.description} onChange={set('description')} rows={5} className="input" placeholder="Detailed product description..." required style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Category</label>
              <select value={form.category} onChange={set('category')} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input label="Price (USD cents, 0 = free)" id="price" type="number" min={0} value={form.price_cents} onChange={set('price_cents')} />
              <Input label="Number of files" id="file_count" type="number" min={1} value={form.file_count} onChange={set('file_count')} />
            </div>

            {/* Product file upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                Product file <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <div
                onClick={() => productFileRef.current?.click()}
                style={{ padding: 'var(--space-5)', border: '2px dashed var(--color-border-muted)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: productFile ? 'var(--color-bg-raised)' : 'transparent' }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: productFile ? 'var(--color-accent)' : 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                  {productFile ? `✓ ${productFile.name} (${(productFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Click to upload .zip, .pdf, .fig, etc.'}
                </p>
              </div>
              <input ref={productFileRef} type="file" style={{ display: 'none' }} onChange={e => setProductFile(e.target.files?.[0] || null)} />
            </div>

            {/* Cover image upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                Cover image (optional)
              </label>
              <div
                onClick={() => coverFileRef.current?.click()}
                style={{ padding: 'var(--space-5)', border: '2px dashed var(--color-border-muted)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: coverFile ? 'var(--color-bg-raised)' : 'transparent' }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: coverFile ? 'var(--color-accent)' : 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                  {coverFile ? `✓ ${coverFile.name}` : 'Click to upload cover image (.png, .jpg, .webp)'}
                </p>
              </div>
              <input ref={coverFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            </div>

            {uploadProgress && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>{uploadProgress}</p>
            )}
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>{error}</p>}
            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? uploadProgress || 'Submitting…' : 'Submit for review'}
            </Button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center', letterSpacing: 'var(--tracking-wide)' }}>
              Your product will be reviewed before publishing.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

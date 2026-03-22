'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function NewShowcasePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!user) { setError('Not logged in.'); return }
    if (files.length === 0) { setError('Please upload at least one image.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: creator } = await supabase.from('creators').select('id').eq('user_id', user.id).single()
      if (!creator) throw new Error('Creator profile required.')

      setStatus('Creating post…')
      const tagList = tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean)

      const { data: post, error: postErr } = await supabase.from('showcase_posts').insert({
        creator_id: creator.id,
        caption,
        tags: tagList,
        published: true,
      }).select('id').single()
      if (postErr) throw new Error(postErr.message)

      for (let i = 0; i < files.length; i++) {
        setStatus(`Uploading image ${i + 1}/${files.length}…`)
        const file = files[i]
        const ext = file.name.split('.').pop()
        const path = `showcase/${creator.id}/${post.id}/${i}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('Products').upload(path, file, { upsert: true })
        if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`)
        const { data: pub } = supabase.storage.from('Products').getPublicUrl(path)

        const { error: mediaErr } = await supabase.from('showcase_media').insert({
          post_id: post.id,
          media_url: pub.publicUrl,
          media_type: 'image',
          width: 600,
          height: 400,
          sort_order: i,
        })
        if (mediaErr) throw new Error(mediaErr.message)
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create post.')
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--space-9) 0' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <Button href="/dashboard" variant="ghost" style={{ marginBottom: 'var(--space-6)' }}>← Back</Button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>New post</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>Share your work</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Image upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                Images <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              {previews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  {previews.map((p, i) => (
                    <img key={i} src={p} alt={`Preview ${i + 1}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }} />
                  ))}
                </div>
              )}
              <div onClick={() => fileRef.current?.click()} style={{ padding: 'var(--space-6)', border: '2px dashed var(--color-border-muted)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: files.length ? 'var(--color-bg-raised)' : 'transparent' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: files.length ? 'var(--color-accent)' : 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                  {files.length ? `✓ ${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Click to upload images (.png, .jpg, .webp)'}
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={onFilesChange} />
            </div>

            {/* Caption */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Caption</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={4} className="input" placeholder="Tell the story behind your work..." style={{ resize: 'vertical' }} />
            </div>

            <Input label="Tags (comma-separated)" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="ui-design, react, illustration" />

            {status && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>{status}</p>}
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>{error}</p>}

            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? status || 'Publishing…' : 'Publish'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

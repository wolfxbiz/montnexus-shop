'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import type { ServiceTierName } from '@/types'

const CATEGORIES = ['design', 'dev', 'consulting', 'writing', 'audio-video']
const TIER_NAMES: ServiceTierName[] = ['basic', 'standard', 'premium']

interface TierForm {
  title: string
  description: string
  price_cents: number
  delivery_time_days: number
  revisions: number
  features: string
}

const emptyTier: TierForm = { title: '', description: '', price_cents: 0, delivery_time_days: 7, revisions: 1, features: '' }

export default function NewServicePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '', slug: '', description: '', short_desc: '',
    category: 'design', delivery_time_days: 7,
  })
  const [tiers, setTiers] = useState<Record<ServiceTierName, TierForm>>({
    basic: { ...emptyTier, title: 'Basic' },
    standard: { ...emptyTier, title: 'Standard' },
    premium: { ...emptyTier, title: 'Premium' },
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const coverRef = useRef<HTMLInputElement>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    if (k === 'title' && !form.slug) {
      const autoSlug = (value as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setForm(f => ({ ...f, title: value as string, slug: autoSlug }))
    } else {
      setForm(f => ({ ...f, [k]: value }))
    }
  }

  const setTier = (name: ServiceTierName, k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setTiers(t => ({ ...t, [name]: { ...t[name], [k]: value } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!user) { setError('Not logged in.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: creator } = await supabase.from('creators').select('id').eq('user_id', user.id).single()
      if (!creator) throw new Error('Creator profile required.')

      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      let cover_url = ''
      if (coverFile) {
        setStatus('Uploading cover…')
        const ext = coverFile.name.split('.').pop()
        const path = `services/${creator.id}/${slug}/cover.${ext}`
        const { error: uploadErr } = await supabase.storage.from('Products').upload(path, coverFile, { upsert: true })
        if (!uploadErr) {
          const { data: pub } = supabase.storage.from('Products').getPublicUrl(path)
          cover_url = pub.publicUrl
        }
      }

      setStatus('Saving service…')
      const { data: service, error: insertErr } = await supabase.from('services').insert({
        title: form.title, slug, description: form.description, short_desc: form.short_desc,
        category: form.category, cover_url, delivery_time_days: form.delivery_time_days,
        creator_id: creator.id, published: false,
      }).select('id').single()
      if (insertErr) throw new Error(insertErr.message)

      setStatus('Saving tiers…')
      const tierRows = TIER_NAMES.map(name => ({
        service_id: service.id,
        name,
        title: tiers[name].title,
        description: tiers[name].description,
        price_cents: tiers[name].price_cents,
        delivery_time_days: tiers[name].delivery_time_days,
        revisions: tiers[name].revisions,
        features: tiers[name].features.split('\n').map(f => f.trim()).filter(Boolean),
      }))
      const { error: tierErr } = await supabase.from('service_tiers').insert(tierRows)
      if (tierErr) throw new Error(tierErr.message)

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create service.')
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--space-9) 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <Button href="/dashboard" variant="ghost" style={{ marginBottom: 'var(--space-6)' }}>← Back</Button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>New service</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>List a service</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Input label="Service title" id="title" value={form.title} onChange={set('title')} required placeholder='e.g. "Custom Logo Design"' />
            <Input label="Slug (auto-generated)" id="slug" value={form.slug} onChange={set('slug')} placeholder="custom-logo-design" />
            <Input label="Short description (max 120 chars)" id="short_desc" value={form.short_desc} onChange={set('short_desc')} maxLength={120} required placeholder="One-line card description" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Full description</label>
              <textarea value={form.description} onChange={set('description')} rows={5} className="input" placeholder="Detailed service description..." required style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Category</label>
                <select value={form.category} onChange={set('category')} className="input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' / ')}</option>)}
                </select>
              </div>
              <Input label="Default delivery (days)" id="delivery" type="number" min={1} value={form.delivery_time_days} onChange={set('delivery_time_days')} />
            </div>

            {/* Cover image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Cover image</label>
              <div onClick={() => coverRef.current?.click()} style={{ padding: 'var(--space-5)', border: '2px dashed var(--color-border-muted)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: coverFile ? 'var(--color-bg-raised)' : 'transparent' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: coverFile ? 'var(--color-accent)' : 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                  {coverFile ? `✓ ${coverFile.name}` : 'Click to upload cover image'}
                </p>
              </div>
              <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            </div>

            {/* Tier Builder */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-6)' }}>
                Pricing tiers
              </div>
              <div className="tier-builder">
                {TIER_NAMES.map(name => (
                  <div key={name} style={{ padding: 'var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: name === 'standard' ? 'var(--color-accent)' : 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                      {name}
                    </div>
                    <Input label="Tier title" id={`${name}-title`} value={tiers[name].title} onChange={setTier(name, 'title')} placeholder="e.g. Starter" />
                    <Input label="Price (USD cents)" id={`${name}-price`} type="number" min={0} value={tiers[name].price_cents} onChange={setTier(name, 'price_cents')} />
                    <Input label="Delivery (days)" id={`${name}-days`} type="number" min={1} value={tiers[name].delivery_time_days} onChange={setTier(name, 'delivery_time_days')} />
                    <Input label="Revisions" id={`${name}-revisions`} type="number" min={0} value={tiers[name].revisions} onChange={setTier(name, 'revisions')} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Features (one per line)</label>
                      <textarea value={tiers[name].features} onChange={setTier(name, 'features')} rows={4} className="input" placeholder={"Source files\nCommercial use\n..."} style={{ resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Description</label>
                      <textarea value={tiers[name].description} onChange={setTier(name, 'description')} rows={2} className="input" placeholder="What's included in this tier" style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {status && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>{status}</p>}
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>{error}</p>}

            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? status || 'Submitting…' : 'Submit for review'}
            </Button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center', letterSpacing: 'var(--tracking-wide)' }}>
              Your service will be reviewed before publishing.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

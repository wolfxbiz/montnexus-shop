'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function BecomeCreatorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({ username: '', display_name: '', bio: '', website: '', twitter: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!user) throw new Error('Not logged in')
      const supabase = createClient()
      const { error: err } = await supabase.from('creators').insert({
        user_id: user.id,
        username: form.username,
        display_name: form.display_name,
        bio: form.bio,
        website: form.website,
        twitter: form.twitter,
      })
      if (err) throw new Error(err.message)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-9) var(--gutter)' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-5)' }}>
            Creator setup
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            Create your profile
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 'var(--leading-loose)' }}>
            Your public creator page will show your products, articles, and links.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input label="Username" id="username" value={form.username} onChange={set('username')} placeholder="your-username" required pattern="[a-z0-9\-]+" title="Lowercase letters, numbers, hyphens only" />
            <Input label="Display name" id="display_name" value={form.display_name} onChange={set('display_name')} placeholder="Your Name" required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                placeholder="A short bio about you and your work..."
                rows={3}
                className="input"
                style={{ resize: 'vertical' }}
              />
            </div>
            <Input label="Website" id="website" type="url" value={form.website} onChange={set('website')} placeholder="https://yoursite.com" />
            <Input label="Twitter / X handle" id="twitter" value={form.twitter} onChange={set('twitter')} placeholder="handle (no @)" />
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wide)' }}>{error}</p>}
            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
              {loading ? 'Creating…' : 'Create creator profile'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

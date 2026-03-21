'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [creator, setCreator] = useState<{ id: string; username: string; display_name: string; bio: string; website: string; twitter: string; avatar_url: string } | null>(null)
  const [form, setForm] = useState({ display_name: '', bio: '', website: '', twitter: '' })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase.from('creators').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (!data) { router.push('/dashboard/become-creator'); return }
        setCreator(data)
        setForm({ display_name: data.display_name, bio: data.bio || '', website: data.website || '', twitter: data.twitter || '' })
        if (data.avatar_url) setAvatarPreview(data.avatar_url)
      })
  }, [user, router])

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setAvatarFile(file)
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!user || !creator) return
    setError('')
    setSaved(false)
    setStatus('Saving…')
    try {
      const supabase = createClient()
      let avatar_url = creator.avatar_url

      if (avatarFile) {
        setStatus('Uploading avatar…')
        const ext = avatarFile.name.split('.').pop()
        const path = `avatars/${creator.id}/avatar.${ext}`
        const { error: uploadErr } = await supabase.storage.from('Products').upload(path, avatarFile, { upsert: true })
        if (uploadErr) throw new Error(`Avatar upload failed: ${uploadErr.message}`)
        const { data: pub } = supabase.storage.from('Products').getPublicUrl(path)
        avatar_url = pub.publicUrl
      }

      const { error: updateErr } = await supabase.from('creators').update({
        display_name: form.display_name,
        bio: form.bio,
        website: form.website,
        twitter: form.twitter,
        avatar_url,
      }).eq('id', creator.id)

      if (updateErr) throw new Error(updateErr.message)
      setSaved(true)
      setStatus('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not save profile.')
      setStatus('')
    }
  }

  if (loading || !creator) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Loading…</p>
    </main>
  )

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--space-9) 0', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: 580 }}>
          <Button href="/dashboard" variant="ghost" style={{ marginBottom: 'var(--space-6)' }}>← Back</Button>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Creator profile</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-8)' }}>Edit profile</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
              <div
                onClick={() => avatarRef.current?.click()}
                style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--color-bg-overlay)', border: '2px dashed var(--color-border-muted)', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center', padding: 4 }}>Upload</span>
                }
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)', marginBottom: 6 }}>Profile picture</p>
                <Button variant="ghost" onClick={() => avatarRef.current?.click()}>
                  {avatarFile ? `✓ ${avatarFile.name}` : 'Choose image'}
                </Button>
              </div>
              <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onAvatarChange} />
            </div>

            {/* Username (read-only) */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 6 }}>Username</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
                @{creator.username}
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>Username cannot be changed.</p>
            </div>

            <Input
              label="Display name"
              id="display_name"
              value={form.display_name}
              onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
              placeholder="Your name"
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell people about yourself and your work..."
                rows={4}
                className="input"
                style={{ resize: 'vertical', lineHeight: 'var(--leading-loose)' }}
              />
            </div>

            <Input
              label="Website"
              id="website"
              type="url"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              placeholder="https://yoursite.com"
            />

            <Input
              label="Twitter / X handle"
              id="twitter"
              value={form.twitter}
              onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
              placeholder="handle (no @)"
            />

            {status && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>{status}</p>}
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>{error}</p>}
            {saved && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>✓ Profile saved successfully.</p>}

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="primary" onClick={handleSave} disabled={!!status} style={{ flex: 1, justifyContent: 'center' }}>
                Save changes
              </Button>
              <Button variant="ghost" href={`/creators/${creator.username}`}>
                View public profile ↗
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

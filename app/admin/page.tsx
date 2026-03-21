'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Nav } from '@/components/layout/Nav'

const ADMIN_EMAILS = ['vivekshajilekha@gmail.com']

type Tab = 'pending' | 'history' | 'creators' | 'users'

type Product = {
  id: string; title: string; slug: string; category: string
  price_cents: number; short_desc: string; description: string
  file_path: string; file_count: number; cover_url: string
  created_at: string; creator_id: string
  creators?: { username: string; display_name: string }
}

type Creator = {
  id: string; username: string; display_name: string; bio: string
  avatar_url: string; website: string; twitter: string
  total_products: number; total_sales: number; created_at: string
  products: [{ count: number }]; articles: [{ count: number }]
}

type UserRecord = {
  id: string; email: string; created_at: string; last_sign_in_at: string
  orders: { id: string; status: string; amount_cents: number; created_at: string; products: { title: string; slug: string } }[]
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('pending')
  const [pending, setPending] = useState<Product[]>([])
  const [history, setHistory] = useState<Product[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [users, setUsers] = useState<UserRecord[]>([])
  const [fetching, setFetching] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [loadingFile, setLoadingFile] = useState<string | null>(null)

  const isAdmin = user && ADMIN_EMAILS.includes(user.email ?? '')

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && user && !isAdmin) router.push('/')
  }, [user, loading, isAdmin, router])

  const getToken = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? ''
  }, [])

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = await getToken()
    return fetch(url, { ...options, headers: { ...options.headers as Record<string,string>, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
  }, [getToken])

  useEffect(() => {
    if (!isAdmin) return
    setFetching(true)
    if (tab === 'pending') {
      authFetch('/api/admin/products').then(r => r.json()).then(d => { setPending(Array.isArray(d) ? d : []); setFetching(false) })
    } else if (tab === 'history') {
      authFetch('/api/admin/history').then(r => r.json()).then(d => { setHistory(Array.isArray(d) ? d : []); setFetching(false) })
    } else if (tab === 'creators') {
      authFetch('/api/admin/creators').then(r => r.json()).then(d => { setCreators(Array.isArray(d) ? d : []); setFetching(false) })
    } else if (tab === 'users') {
      authFetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(Array.isArray(d) ? d : []); setFetching(false) })
    }
  }, [tab, isAdmin, authFetch])

  async function approve(id: string) {
    setActionId(id)
    await authFetch('/api/admin/products', { method: 'PATCH', body: JSON.stringify({ id, published: true }) })
    setPending(p => p.filter(x => x.id !== id))
    setExpandedId(null); setActionId(null)
  }

  async function reject(id: string) {
    if (!confirm('Delete this product submission?')) return
    setActionId(id)
    await authFetch('/api/admin/products', { method: 'DELETE', body: JSON.stringify({ id }) })
    setPending(p => p.filter(x => x.id !== id))
    setExpandedId(null); setActionId(null)
  }

  async function previewFile(id: string, file_path: string) {
    if (fileUrls[id]) { window.open(fileUrls[id], '_blank'); return }
    setLoadingFile(id)
    const res = await authFetch('/api/admin/products', { method: 'POST', body: JSON.stringify({ file_path }) })
    const data = await res.json()
    if (data.url) { setFileUrls(prev => ({ ...prev, [id]: data.url })); window.open(data.url, '_blank') }
    setLoadingFile(null)
  }

  if (loading || !user || !isAdmin) return null

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: `Pending${pending.length ? ` (${pending.length})` : ''}` },
    { id: 'history', label: 'Approved' },
    { id: 'creators', label: 'Creators' },
    { id: 'users', label: 'Users' },
  ]

  return (
    <>
      <Nav />
      <main style={{ padding: 'var(--space-9) 0', minHeight: '100vh' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Admin Panel</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', marginBottom: 'var(--space-8)' }}>Signed in as {user.email}</p>

          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-muted)', marginBottom: 'var(--space-8)', gap: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setExpandedId(null) }} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', padding: 'var(--space-3) var(--space-5)', background: 'none', border: 'none', borderBottom: tab === t.id ? '2px solid var(--color-accent)' : '2px solid transparent', color: tab === t.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', marginBottom: -1 }}>
                {t.label}
              </button>
            ))}
          </div>

          {fetching && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>Loading…</p>}

          {/* PENDING TAB */}
          {tab === 'pending' && !fetching && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {pending.length === 0 && <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-10) 0' }}>No products pending review.</p>}
              {pending.map(p => (
                <div key={p.id} style={{ background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                    {p.cover_url && <img src={p.cover_url} alt={p.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{p.title}</span>
                        <Tag variant="default">{p.category}</Tag>
                        <Tag variant={p.price_cents === 0 ? 'free' : 'paid'}>{p.price_cents === 0 ? 'Free' : `$${(p.price_cents / 100).toFixed(2)}`}</Tag>
                      </div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>{expandedId === p.id ? 'Collapse ↑' : 'Review ↓'}</Button>
                  </div>
                  {expandedId === p.id && (
                    <div style={{ borderTop: '1px solid var(--color-border-muted)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                      {p.cover_url && <img src={p.cover_url} alt={p.title} style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        {[['Slug', p.slug], ['Category', p.category], ['Price', p.price_cents === 0 ? 'Free' : `$${(p.price_cents / 100).toFixed(2)}`], ['Files', String(p.file_count)]].map(([label, value]) => (
                          <div key={label}><div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 4 }}>{label}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>{value}</div></div>
                        ))}
                      </div>
                      <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 6 }}>Short description</div><p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{p.short_desc}</p></div>
                      <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 6 }}>Full description</div><p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap', lineHeight: 'var(--leading-loose)' }}>{p.description}</p></div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 6 }}>Product file</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>{p.file_path || 'No file'}</span>
                          {p.file_path && <Button variant="secondary" onClick={() => previewFile(p.id, p.file_path)} disabled={loadingFile === p.id}>{loadingFile === p.id ? 'Generating…' : 'Download & verify'}</Button>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-muted)' }}>
                        <Button variant="primary" onClick={() => approve(p.id)} disabled={actionId === p.id}>{actionId === p.id ? '…' : '✓ Approve & publish'}</Button>
                        <Button variant="ghost" onClick={() => reject(p.id)} disabled={actionId === p.id}>✕ Reject & delete</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && !fetching && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {history.length === 0 && <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-10) 0' }}>No approved products yet.</p>}
              {history.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap' }}>
                  {p.cover_url && <img src={p.cover_url} alt={p.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{p.title}</span>
                      <Tag variant="default">{p.category}</Tag>
                      <Tag variant="accent">Published</Tag>
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      by {(p.creators as { username: string; display_name: string })?.display_name ?? '—'} · {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>{p.price_cents === 0 ? 'Free' : `$${(p.price_cents / 100).toFixed(2)}`}</span>
                </div>
              ))}
            </div>
          )}

          {/* CREATORS TAB */}
          {tab === 'creators' && !fetching && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {creators.length === 0 && <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-10) 0' }}>No creators yet.</p>}
              {creators.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-bg-overlay)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.avatar_url
                      ? <img src={c.avatar_url} alt={c.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{c.display_name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{c.display_name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>@{c.username} · Joined {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
                    {[['Products', c.products?.[0]?.count ?? 0], ['Articles', c.articles?.[0]?.count ?? 0], ['Sales', c.total_sales]].map(([label, val]) => (
                      <div key={label as string} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{val}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" href={`/creators/${c.username}`}>View ↗</Button>
                </div>
              ))}
            </div>
          )}

          {/* USERS TAB */}
          {tab === 'users' && !fetching && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {users.length === 0 && <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-10) 0' }}>No users yet.</p>}
              {users.map(u => (
                <div key={u.id} style={{ background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 2 }}>{u.email}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        Joined {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {u.last_sign_in_at && ` · Last seen ${new Date(u.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <Tag variant={u.orders.length > 0 ? 'paid' : 'default'}>{u.orders.length} purchase{u.orders.length !== 1 ? 's' : ''}</Tag>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{expandedUser === u.id ? '↑' : '↓'}</span>
                    </div>
                  </div>
                  {expandedUser === u.id && u.orders.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--color-border-muted)', padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 'var(--space-2)' }}>Purchase history</div>
                      {u.orders.map(o => (
                        <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{(o.products as { title: string })?.title ?? 'Unknown product'}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <Tag variant={o.status === 'free' ? 'free' : 'paid'}>{o.status === 'free' ? 'Free' : `$${(o.amount_cents / 100).toFixed(2)}`}</Tag>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {expandedUser === u.id && u.orders.length === 0 && (
                    <div style={{ borderTop: '1px solid var(--color-border-muted)', padding: 'var(--space-4) var(--space-5)' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>No purchases yet.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

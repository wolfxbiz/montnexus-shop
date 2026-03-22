'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

type Tab = 'purchases' | 'products' | 'services' | 'showcase' | 'articles' | 'settings'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('purchases')
  const [creator, setCreator] = useState<{ id: string; username: string; display_name: string } | null>(null)
  const [orders, setOrders] = useState<{ id: string; status: string; amount_cents: number; created_at: string; products: { title: string; slug: string } }[]>([])
  const [products, setProducts] = useState<{ id: string; title: string; slug: string; price_cents: number; published: boolean }[]>([])
  const [services, setServices] = useState<{ id: string; title: string; slug: string; published: boolean; category: string }[]>([])
  const [showcasePosts, setShowcasePosts] = useState<{ id: string; caption: string; published: boolean; created_at: string }[]>([])
  const [articles, setArticles] = useState<{ id: string; title: string; slug: string; published: boolean; published_at: string }[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    // Fetch orders
    supabase.from('orders').select('*, products(title, slug)').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []))
    // Fetch creator profile
    supabase.from('creators').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setCreator(data)
          supabase.from('products').select('*').eq('creator_id', data.id).then(({ data: p }) => setProducts(p || []))
          supabase.from('services').select('*').eq('creator_id', data.id).then(({ data: s }) => setServices(s || []))
          supabase.from('showcase_posts').select('*').eq('creator_id', data.id).order('created_at', { ascending: false }).then(({ data: sp }) => setShowcasePosts(sp || []))
          supabase.from('articles').select('*').eq('creator_id', data.id).then(({ data: a }) => setArticles(a || []))
        }
      })
  }, [user])

  if (loading || !user) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Loading…</p>
    </main>
  )

  const tabs: { id: Tab; label: string }[] = [
    { id: 'purchases', label: 'Purchases' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'showcase', label: 'Showcase' },
    { id: 'articles', label: 'Articles' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-8) 0 var(--space-4)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 4 }}>Dashboard</h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>{user.email}</p>
              </div>
              {!creator && (
                <Button href="/dashboard/become-creator" variant="free">Become a creator</Button>
              )}
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border-muted)', marginBottom: 'var(--space-8)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-wider)',
                    textTransform: 'uppercase',
                    padding: 'var(--space-3) var(--space-5)',
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === t.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                    color: tab === t.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'color var(--transition-fast)',
                    marginBottom: -1,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minHeight: 44,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Purchases tab */}
            {tab === 'purchases' && (
              <div>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-6)' }}>No purchases yet</p>
                    <Button href="/bundles" variant="secondary">Browse bundles</Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{order.products?.title}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                          <Tag variant={order.status === 'free' ? 'free' : 'paid'}>{order.status === 'free' ? 'Free' : `$${(order.amount_cents / 100).toFixed(2)}`}</Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Products tab */}
            {tab === 'products' && (
              <div>
                {!creator ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>You need a creator profile to list products.</p>
                    <Button href="/dashboard/become-creator" variant="primary">Create your profile</Button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
                      <Button href="/dashboard/products/new" variant="primary">+ New product</Button>
                    </div>
                    {products.length === 0 ? (
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-8) 0' }}>No products yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {products.map(p => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                            <div>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{p.title}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>${(p.price_cents / 100).toFixed(2)}</div>
                            </div>
                            <Tag variant={p.published ? 'accent' : 'default'}>{p.published ? 'Published' : 'Draft'}</Tag>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* My Services tab */}
            {tab === 'services' && (
              <div>
                {!creator ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>You need a creator profile to offer services.</p>
                    <Button href="/dashboard/become-creator" variant="primary">Create your profile</Button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
                      <Button href="/dashboard/services/new" variant="primary">+ New service</Button>
                    </div>
                    {services.length === 0 ? (
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-8) 0' }}>No services yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {services.map(s => (
                          <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                            <div>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{s.title}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{s.category}</div>
                            </div>
                            <Tag variant={s.published ? 'accent' : 'default'}>{s.published ? 'Published' : 'Draft'}</Tag>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* My Showcase tab */}
            {tab === 'showcase' && (
              <div>
                {!creator ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>You need a creator profile to post in the showcase.</p>
                    <Button href="/dashboard/become-creator" variant="primary">Create your profile</Button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
                      <Button href="/dashboard/showcase/new" variant="primary">+ New post</Button>
                    </div>
                    {showcasePosts.length === 0 ? (
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-8) 0' }}>No showcase posts yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {showcasePosts.map(sp => (
                          <div key={sp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                            <div>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
                                {sp.caption ? (sp.caption.length > 60 ? sp.caption.slice(0, 60) + '…' : sp.caption) : 'Untitled post'}
                              </div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                {new Date(sp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            <Tag variant={sp.published ? 'accent' : 'default'}>{sp.published ? 'Published' : 'Draft'}</Tag>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* My Articles tab */}
            {tab === 'articles' && (
              <div>
                {!creator ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>You need a creator profile to write articles.</p>
                    <Button href="/dashboard/become-creator" variant="primary">Create your profile</Button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-6)' }}>
                      <Button href="/dashboard/articles/new" variant="primary">+ New article</Button>
                    </div>
                    {articles.length === 0 ? (
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-8) 0' }}>No articles yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {articles.map(a => (
                          <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                            <div>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{a.title}</div>
                              {a.published_at && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                              <Tag variant={a.published ? 'accent' : 'default'}>{a.published ? 'Published' : 'Draft'}</Tag>
                              <Button href={`/dashboard/articles/${a.id}/edit`} variant="ghost">Edit</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Settings tab */}
            {tab === 'settings' && (
              <div style={{ maxWidth: 500 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>Account</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-6)', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)', borderRadius: 'var(--radius-lg)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                    <div style={{ color: 'var(--color-text-primary)' }}>{user.email}</div>
                  </div>
                  {creator && (
                    <>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 4 }}>Creator profile</div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                          <Button href="/dashboard/profile/edit" variant="primary">Edit profile</Button>
                          <Button href={`/creators/${creator.username}`} variant="ghost">View public profile →</Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

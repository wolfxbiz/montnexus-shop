'use client'
import { useState } from 'react'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { mockProducts } from '@/lib/mock-products'
import type { ProductCategory } from '@/types'

const CATEGORIES: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Design', value: 'design' },
  { label: 'Dev', value: 'dev' },
  { label: 'Icons', value: 'icon' },
  { label: 'eBooks', value: 'ebook' },
  { label: 'Templates', value: 'template' },
]

export default function BundlesPage() {
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [freeOnly, setFreeOnly] = useState(false)

  const filtered = mockProducts.filter(p => {
    if (!p.published) return false
    if (category !== 'all' && p.category !== category) return false
    if (freeOnly && !p.is_free) return false
    return true
  })

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-9) 0 var(--space-6)' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, var(--text-3xl))', fontWeight: 400, color: 'var(--color-text-primary)', marginBottom: 'var(--space-5)' }}>
              Browse Bundles
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
              Curated digital assets for designers and developers.
            </p>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`tag ${category === cat.value ? 'tag-accent' : 'tag-default'}`}
                  style={{ cursor: 'pointer', border: 'none', background: undefined }}
                >
                  {cat.label}
                </button>
              ))}
              <button
                onClick={() => setFreeOnly(!freeOnly)}
                className={`tag ${freeOnly ? 'tag-free' : 'tag-default'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Free only
              </button>
            </div>
            {/* Grid */}
            <div className="product-grid">
              {filtered.map(p => <Card key={p.id} product={p} />)}
              {filtered.length === 0 && (
                <p style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                  No bundles found.
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

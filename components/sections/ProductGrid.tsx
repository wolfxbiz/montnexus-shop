import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import type { ProductPublic } from '@/types'

interface ProductGridProps {
  products: ProductPublic[]
  title?: string
  label?: string
  viewAllHref?: string
}

export function ProductGrid({ products, title, label, viewAllHref }: ProductGridProps) {
  return (
    <section className="section">
      <div className="container">
        {(label || title || viewAllHref) && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            <div>
              {label && <div className="section-label">{label}</div>}
              {title && (
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))', fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {title}
                </h2>
              )}
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wide)', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                View all →
              </Link>
            )}
          </div>
        )}
        <div className="product-grid reveal-group">
          {products.map(product => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

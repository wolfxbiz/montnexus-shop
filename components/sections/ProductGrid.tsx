import { Card } from '@/components/ui/Card'
import type { ProductPublic } from '@/types'

interface ProductGridProps {
  products: ProductPublic[]
  title?: string
  label?: string
}

export function ProductGrid({ products, title, label }: ProductGridProps) {
  return (
    <section className="section">
      <div className="container">
        {label && <div className="section-label">{label}</div>}
        {title && (
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-8)',
          }}>
            {title}
          </h2>
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

import Link from 'next/link'
import Image from 'next/image'
import { Tag } from './Tag'
import { Button } from './Button'
import type { ProductPublic } from '@/types'

interface CardProps {
  product: ProductPublic
}

export function Card({ product }: CardProps) {
  const price = product.is_free
    ? null
    : `$${(product.price_cents / 100).toFixed(2)}`

  return (
    <Link href={`/bundles/${product.slug}`} className="card block" style={{ textDecoration: 'none' }}>
      <div className="card-cover">
        {product.cover_url && (
          <Image
            src={product.cover_url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <h3 className="card-title">{product.title}</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-normal)' }}>
          {product.short_desc}
        </p>
        <div className="card-footer">
          <div>
            {product.is_free
              ? <span className="card-price free">Free</span>
              : <span className="card-price">{price}</span>
            }
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Tag variant={product.is_free ? 'free' : 'paid'}>
              {product.is_free ? 'Free' : 'Paid'}
            </Tag>
            <Tag variant="default">{product.file_count} {product.file_count === 1 ? 'file' : 'files'}</Tag>
          </div>
        </div>
      </div>
    </Link>
  )
}

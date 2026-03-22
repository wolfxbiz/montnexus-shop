import Link from 'next/link'
import Image from 'next/image'
import { Tag } from './Tag'
import type { Service } from '@/types'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const startingPrice = service.tiers && service.tiers.length > 0
    ? Math.min(...service.tiers.map(t => t.price_cents))
    : 0

  return (
    <Link href={`/services/${service.slug}`} className="card block" style={{ textDecoration: 'none' }}>
      <div className="card-cover">
        {service.cover_url && (
          <Image
            src={service.cover_url}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="card-body">
        <div className="card-category">{service.category}</div>
        <h3 className="card-title">{service.title}</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-normal)' }}>
          {service.short_desc}
        </p>
        <div className="card-footer">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>From</span>
            <span className="card-price">${(startingPrice / 100).toFixed(0)}</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Tag variant="sage">Service</Tag>
            {service.creator && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                {service.creator.display_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

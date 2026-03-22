import Link from 'next/link'
import { ServiceCard } from '@/components/ui/ServiceCard'
import type { Service } from '@/types'

interface ServiceGridProps {
  services: Service[]
  title?: string
  label?: string
  viewAllHref?: string
  noPaddingTop?: boolean
}

export function ServiceGrid({ services, title, label, viewAllHref, noPaddingTop }: ServiceGridProps) {
  return (
    <section
      className="section"
      style={noPaddingTop ? { paddingTop: 'var(--space-5)', background: 'var(--color-bg-raised)', borderBottom: '1px solid var(--color-border)' } : undefined}
    >
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
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

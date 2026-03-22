import { ServiceCard } from '@/components/ui/ServiceCard'
import type { Service } from '@/types'

interface ServiceGridProps {
  services: Service[]
  title?: string
  label?: string
}

export function ServiceGrid({ services, title, label }: ServiceGridProps) {
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
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

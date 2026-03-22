import Link from 'next/link'
import Image from 'next/image'
import type { ProductPublic } from '@/types'

interface FreeSpotlightProps {
  products: ProductPublic[]
  viewAllHref?: string
}

export function FreeSpotlight({ products, viewAllHref }: FreeSpotlightProps) {
  if (!products.length) return null
  const items = products.slice(0, 6)

  return (
    <section style={{
      padding: 'var(--space-8) 0',
      background: 'linear-gradient(180deg, var(--color-accent-glow) 0%, transparent 100%), var(--color-bg-base)',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-7)',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-accent)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                padding: '3px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-accent)',
                background: 'var(--color-accent-soft)',
              }}>
                Free downloads
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))',
              fontWeight: 400,
              color: 'var(--color-text-primary)',
            }}>
              Grab for free
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                letterSpacing: 'var(--tracking-wide)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              View all free →
            </Link>
          )}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 'var(--space-4)',
        }}
        className="free-grid"
        >
          {items.map(product => (
            <Link
              key={product.id}
              href={`/bundles/${product.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                style={{
                  background: 'var(--color-bg-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'border-color var(--transition-fast), transform var(--transition-base)',
                }}
                className="free-card"
              >
                {/* Cover */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  background: 'var(--color-bg-overlay)',
                  overflow: 'hidden',
                }}>
                  {product.cover_url ? (
                    <Image
                      src={product.cover_url}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 240px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-bg-overlay))',
                    }} />
                  )}
                  {/* FREE badge */}
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'var(--color-accent)',
                    color: 'var(--color-text-inverted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: 'var(--tracking-wide)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 500,
                  }}>
                    FREE
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: 'var(--space-3) var(--space-4) var(--space-4)' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--space-2)',
                  }}>
                    {product.category}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 'var(--leading-tight)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    {product.title}
                  </div>
                  {product.file_count > 0 && (
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--color-text-tertiary)',
                    }}>
                      {product.file_count} {product.file_count === 1 ? 'file' : 'files'} included
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

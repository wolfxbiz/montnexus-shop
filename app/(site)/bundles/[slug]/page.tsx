export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { mockProducts } from '@/lib/mock-products'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = mockProducts.find(p => p.slug === slug && p.published)
  if (!product) notFound()

  const price = product.is_free ? 'Free' : `$${(product.price_cents / 100).toFixed(2)}`

  return (
    <>
      <Nav />
      <main>
        <section style={{ padding: 'var(--space-9) 0' }}>
          <div className="container">
            <div className="two-col">
              {/* Cover */}
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-muted)' }}>
                {product.cover_url && (
                  <Image src={product.cover_url} alt={product.title} fill style={{ objectFit: 'cover' }} />
                )}
              </div>
              {/* Info */}
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                  <Tag variant="default">{product.category}</Tag>
                  <Tag variant={product.is_free ? 'free' : 'paid'}>{product.is_free ? 'Free' : 'Paid'}</Tag>
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-5)' }}>
                  {product.title}
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-loose)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) 0', borderTop: '1px solid var(--color-border-muted)', borderBottom: '1px solid var(--color-border-muted)', marginBottom: 'var(--space-8)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 4 }}>Price</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', color: product.is_free ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{price}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 4 }}>Files</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>{product.file_count}</div>
                  </div>
                </div>
                {product.is_free ? (
                  <Button variant="free" href={`/auth/login?redirect=/bundles/${product.slug}`}>
                    Download free
                  </Button>
                ) : (
                  <Button variant="primary" href={`/checkout/${product.id}`}>
                    Buy for {price}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return mockProducts.filter(p => p.published).map(p => ({ slug: p.slug }))
}

import Link from 'next/link'
import Image from 'next/image'

const MOSAIC = [
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    alt: 'Abstract design work',
    span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    alt: 'Creative illustration',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=600&q=80',
    alt: 'Interface design',
    span: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=600&q=80',
    alt: 'Typography design',
    span: 'small',
  },
]

const STATS = [
  { value: '1,200+', label: 'Creators' },
  { value: '5,000+', label: 'Posts shared' },
  { value: '40+', label: 'Categories' },
]

export function CommunityHero() {
  return (
    <section
      style={{
        background: `
          radial-gradient(ellipse 60% 80% at 10% 50%, rgba(138,171,150,0.09) 0%, transparent 55%),
          radial-gradient(ellipse 50% 60% at 90% 20%, rgba(100,148,168,0.08) 0%, transparent 50%),
          var(--color-bg-base)
        `,
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-9) 0',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-9)',
            alignItems: 'center',
          }}
          className="community-hero-grid"
        >
          {/* Left: mosaic */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto',
              gap: 'var(--space-3)',
              maxWidth: 440,
            }}
            className="community-mosaic"
          >
            {/* Large top-left image */}
            <div style={{
              gridRow: '1 / 3',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              aspectRatio: '3/4',
            }}>
              <Image
                src={MOSAIC[0].src}
                alt={MOSAIC[0].alt}
                width={300}
                height={400}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Top-right: wide */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              aspectRatio: '4/3',
            }}>
              <Image
                src={MOSAIC[1].src}
                alt={MOSAIC[1].alt}
                width={300}
                height={220}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Bottom-right two small squares */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {MOSAIC.slice(2).map((img, i) => (
                <div key={i} style={{
                  borderRadius: 'var(--radius-base)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  aspectRatio: '1',
                }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={160}
                    height={160}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
              {/* "See more" tile */}
              <div style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                aspectRatio: '1',
                background: 'var(--color-bg-overlay)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>+5k</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>posts</span>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-sage)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-4)',
            }}>
              Community showcase
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 'var(--leading-tight)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-5)',
            }}>
              A living gallery<br />
              <span style={{ color: 'var(--color-sage)' }}>of creative work</span>
            </h2>

            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-loose)',
              marginBottom: 'var(--space-7)',
              maxWidth: 440,
            }}>
              Share your latest projects, get inspired by other creators, and build an audience around the work you love making. Designers, developers, and artists — all in one place.
            </p>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-7)',
              flexWrap: 'wrap',
            }}>
              {STATS.map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                    marginBottom: 'var(--space-1)',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link href="/showcase" className="btn btn-primary">
                Explore showcase
              </Link>
              <Link href="/dashboard/showcase/new" className="btn btn-ghost">
                Share your work →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

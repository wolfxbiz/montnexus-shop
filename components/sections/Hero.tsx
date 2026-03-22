'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

const ROLES = ['designers', 'developers', 'illustrators', 'writers', 'architects', 'engineers', 'professors', 'teachers']

const STATS = [
  { value: '1,200+', label: 'Creators' },
  { value: '3,400+', label: 'Products' },
  { value: '40+', label: 'Services' },
  { value: '5,000+', label: 'Posts shared' },
]

export function Hero() {
  const rolRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let i = 0
    let charIndex = 0
    let deleting = false
    let timeout: ReturnType<typeof setTimeout>

    function tick() {
      const el = rolRef.current
      if (!el) return
      const word = ROLES[i]

      if (!deleting) {
        el.textContent = word.slice(0, charIndex + 1)
        charIndex++
        if (charIndex === word.length) {
          deleting = true
          timeout = setTimeout(tick, 1800)
          return
        }
        timeout = setTimeout(tick, 75)
      } else {
        el.textContent = word.slice(0, charIndex - 1)
        charIndex--
        if (charIndex === 0) {
          deleting = false
          i = (i + 1) % ROLES.length
          timeout = setTimeout(tick, 300)
          return
        }
        timeout = setTimeout(tick, 40)
      }
    }

    timeout = setTimeout(tick, 600)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section
      className="grain-overlay"
      data-section-theme="moss"
      style={{
        minHeight: 'min(90vh, 780px)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'var(--space-9)',
        paddingBottom: 'var(--space-9)',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(106,158,120,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 10% 80%, rgba(100,148,168,0.10) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 90% 60%, rgba(138,171,150,0.08) 0%, transparent 50%),
          var(--color-bg-base)
        `,
      }}
    >
      <div className="container">
        {/* Hero body */}
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>

          {/* Eyebrow pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border-strong)', background: 'var(--color-accent-soft)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
              The creative community
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, var(--text-4xl))',
            fontWeight: 400,
            lineHeight: 'var(--leading-tight)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-6)',
            letterSpacing: '-0.01em',
          }}>
            Where{' '}
            <span
              ref={rolRef}
              style={{
                color: 'var(--color-accent)',
                borderRight: '2px solid var(--color-accent)',
                paddingRight: 2,
                minWidth: '1ch',
                display: 'inline-block',
              }}
            >
              designers
            </span>
            <br />
            build, learn and grow
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-loose)',
            marginBottom: 'var(--space-8)',
            maxWidth: 580,
            margin: '0 auto var(--space-8)',
          }}>
            A platform for artists, developers, and professionals to sell digital products, offer services, share their work, and connect with a community that gets it.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-10)' }}>
            <Link href="/bundles" className="btn btn-primary">Explore products</Link>
            <Link href="/showcase" className="btn btn-secondary">See the showcase</Link>
            <Link href="/dashboard/become-creator" className="btn btn-ghost">Join as creator →</Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-8)',
            flexWrap: 'wrap',
            paddingTop: 'var(--space-7)',
            borderTop: '1px solid var(--color-border-muted)',
          }}
          className="hero-stats"
          >
            {STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
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
        </div>
      </div>
    </section>
  )
}

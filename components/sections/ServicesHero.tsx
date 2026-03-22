'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    label: 'Design',
    headlineTop: 'Work with talented',
    headlineBottom: 'designers',
    description: 'Brand identity, UI/UX, illustration — crafted by creators who deliver polished, production-ready work.',
    cta: { text: 'Browse designers', href: '/services?category=design' },
    accent: '#6a9e78',
    accentSoft: 'rgba(106,158,120,0.12)',
    chips: ['Logo & Branding', 'UI Kit Design', 'Illustration', 'Icon Systems'],
    cardLabel: 'Custom Brand Identity',
    cardPrice: 'From $149',
    cardRating: '4.9',
  },
  {
    label: 'Development',
    headlineTop: 'Ship faster with',
    headlineBottom: 'expert developers',
    description: 'React components, full-stack builds, and technical audits from engineers who care about clean code.',
    cta: { text: 'Find a developer', href: '/services?category=dev' },
    accent: '#6494a8',
    accentSoft: 'rgba(100,148,168,0.12)',
    chips: ['React / Next.js', 'API Integration', 'Code Review', 'Full-Stack Apps'],
    cardLabel: 'React Component Library',
    cardPrice: 'From $299',
    cardRating: '5.0',
  },
  {
    label: 'Consulting',
    headlineTop: 'Get expert advice',
    headlineBottom: 'on demand',
    description: 'Strategy sessions, product reviews, and UX audits from seasoned practitioners who have shipped real products.',
    cta: { text: 'Book a session', href: '/services?category=consulting' },
    accent: '#8aab96',
    accentSoft: 'rgba(138,171,150,0.1)',
    chips: ['UX Audit', 'Product Strategy', 'Tech Review', 'Growth Planning'],
    cardLabel: 'UX & Product Audit',
    cardPrice: 'From $199',
    cardRating: '4.8',
  },
]

export function ServicesHero() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((next: number) => {
    if (animating || next === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(next)
      setAnimating(false)
    }, 320)
  }, [active, animating])

  useEffect(() => {
    const t = setInterval(() => {
      goTo((active + 1) % SLIDES.length)
    }, 4800)
    return () => clearInterval(t)
  }, [active, goTo])

  const slide = SLIDES[active]

  return (
    <section
      className="services-hero-section"
      style={{
        background: `radial-gradient(ellipse 80% 70% at 80% 50%, ${slide.accentSoft} 0%, transparent 60%), var(--color-bg-raised)`,
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-7) 0 var(--space-5)',
        transition: 'background 0.6s ease',
      }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-9)',
          alignItems: 'center',
        }}
        className="services-hero-grid"
        >
          {/* Left: text content */}
          <div>
            {/* Slide counter + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: slide.accent,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                transition: 'color 0.4s ease',
              }}>
                {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')} — {slide.label}
              </span>
              <div style={{ height: 1, flex: 1, background: 'var(--color-border)', maxWidth: 60 }} />
            </div>

            {/* Headline */}
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? 'translateY(12px)' : 'translateY(0)',
                transition: 'opacity 0.32s ease, transform 0.32s ease',
              }}
            >
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 400,
                lineHeight: 'var(--leading-tight)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-5)',
              }}>
                {slide.headlineTop}<br />
                <span style={{ color: slide.accent, transition: 'color 0.4s ease' }}>{slide.headlineBottom}</span>
              </h2>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-loose)',
                marginBottom: 'var(--space-6)',
                maxWidth: 460,
              }}>
                {slide.description}
              </p>

              {/* Chips */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-7)' }}>
                {slide.chips.map(chip => (
                  <span key={chip} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-wide)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${slide.accent}`,
                    color: slide.accent,
                    background: slide.accentSoft,
                    transition: 'all 0.4s ease',
                  }}>
                    {chip}
                  </span>
                ))}
              </div>

              <Link
                href={slide.cta.href}
                className="btn btn-primary"
                style={{ background: slide.accent, borderColor: slide.accent }}
              >
                {slide.cta.text} →
              </Link>
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-8)', alignItems: 'center' }}>
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${s.label} slide`}
                  style={{
                    width: i === active ? 28 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-full)',
                    background: i === active ? slide.accent : 'var(--color-border-strong)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: decorative service card mockup */}
          <div
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateX(16px) scale(0.98)' : 'translateX(0) scale(1)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              display: 'flex',
              justifyContent: 'center',
            }}
            className="services-hero-visual"
          >
            <div style={{
              width: '100%',
              maxWidth: 360,
              background: 'var(--color-bg-overlay)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              {/* Card cover strip */}
              <div style={{
                height: 140,
                background: `linear-gradient(135deg, ${slide.accentSoft}, ${slide.accent}22)`,
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Abstract grid lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }} viewBox="0 0 360 140" preserveAspectRatio="none">
                  {[0, 60, 120, 180, 240, 300, 360].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="140" stroke={slide.accent} strokeWidth="0.5" />
                  ))}
                  {[0, 35, 70, 105, 140].map(y => (
                    <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={slide.accent} strokeWidth="0.5" />
                  ))}
                </svg>
                {/* Centre label */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: slide.accent,
                  letterSpacing: 'var(--tracking-wider)',
                  textTransform: 'uppercase',
                  background: 'var(--color-bg-overlay)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${slide.accent}`,
                }}>
                  {slide.label}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: 'var(--space-5)' }}>
                {/* Title skeleton */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)',
                }}>
                  {slide.cardLabel}
                </div>

                {/* Sub skeleton lines */}
                {[80, 65].map((w, i) => (
                  <div key={i} style={{
                    height: 6,
                    width: `${w}%`,
                    background: 'var(--color-border-strong)',
                    borderRadius: 3,
                    marginBottom: 'var(--space-2)',
                    opacity: 0.6,
                  }} />
                ))}

                <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--space-4) 0' }} />

                {/* Price + rating row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Starting at</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: slide.accent, fontWeight: 500 }}>{slide.cardPrice}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={slide.accent}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{slide.cardRating}</span>
                  </div>
                </div>

                {/* CTA button mock */}
                <div style={{
                  marginTop: 'var(--space-4)',
                  background: slide.accentSoft,
                  border: `1px solid ${slide.accent}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 0',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: slide.accent,
                  letterSpacing: 'var(--tracking-wide)',
                }}>
                  View tiers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

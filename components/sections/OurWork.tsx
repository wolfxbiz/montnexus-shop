'use client'

const PROJECTS = [
  {
    name: 'Tott Books',
    url: 'https://tottbooks.com',
    domain: 'tottbooks.com',
    category: 'E-commerce',
    description: 'Online bookstore with curated collections and seamless shopping experience.',
    accent: '#6B8CBA',
    accentSoft: 'rgba(107,140,186,0.08)',
    dots: ['#6B8CBA', '#8FADD4', '#B3C9E8'],
  },
  {
    name: 'Turquoic',
    url: 'https://turquoic.com',
    domain: 'turquoic.com',
    category: 'Brand & Web',
    description: 'Modern brand presence with a polished web experience built for growth.',
    accent: '#3AAFA9',
    accentSoft: 'rgba(58,175,169,0.08)',
    dots: ['#3AAFA9', '#5FBFBA', '#8DD4D0'],
  },
  {
    name: 'Imex Tires',
    url: 'https://imextires.com',
    domain: 'imextires.com',
    category: 'Business Website',
    description: 'High-performance tire distributor site with product catalogue and dealer locator.',
    accent: '#C0762A',
    accentSoft: 'rgba(192,118,42,0.08)',
    dots: ['#C0762A', '#D4954E', '#E8B980'],
  },
  {
    name: 'Montnexus',
    url: 'https://montnexus.com',
    domain: 'montnexus.com',
    category: 'SaaS Platform',
    description: 'Full-stack digital platform connecting creators, services, and communities.',
    accent: '#6A9E78',
    accentSoft: 'rgba(106,158,120,0.08)',
    dots: ['#6A9E78', '#88B594', '#AACBB3'],
  },
]

export function OurWork() {
  return (
    <section
      style={{
        padding: 'var(--space-9) 0',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
      }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="section-label">Our Work</div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, var(--text-2xl))',
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                marginTop: 'var(--space-2)',
              }}
            >
              Products we&apos;ve shipped
            </h2>
          </div>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-loose)',
              maxWidth: '340px',
              textAlign: 'right',
            }}
          >
            A selection of live projects designed and built by our team.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {PROJECTS.map((project) => (
            <a
              key={project.domain}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-raised)',
                overflow: 'hidden',
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = project.accent
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = `0 8px 32px ${project.accentSoft}`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'var(--color-border)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Browser chrome mockup */}
              <div
                style={{
                  background: project.accentSoft,
                  borderBottom: '1px solid var(--color-border)',
                  padding: '12px 16px 10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  {project.dots.map((dot, i) => (
                    <span
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: dot,
                        opacity: 0.7,
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    padding: '5px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: 'var(--tracking-wide)',
                  }}
                >
                  {project.domain}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: project.accentSoft,
                    border: `1px solid ${project.accent}30`,
                    width: 'fit-content',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: project.accent,
                      letterSpacing: 'var(--tracking-wider)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 400,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  {project.name}
                </h3>

                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--leading-loose)',
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {project.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginTop: 'auto',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: project.accent,
                      letterSpacing: 'var(--tracking-wide)',
                    }}
                  >
                    Visit site →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

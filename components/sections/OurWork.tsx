'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const FONT = "var(--font-eb-garamond), 'EB Garamond', Georgia, serif"
const HEADING_FONT = "'The Seasons', Georgia, serif"

const PROJECTS = [
  {
    number: '01',
    name: 'Tott Books',
    url: 'https://tottbooks.com',
    domain: 'tottbooks.com',
    category: 'E-commerce',
    description: 'Online bookstore with curated collections and a seamless shopping experience.',
    tags: ['Next.js', 'Shopify', 'UI/UX'],
  },
  {
    number: '02',
    name: 'Turquoic',
    url: 'https://turquoic.com',
    domain: 'turquoic.com',
    category: 'Brand & Web',
    description: 'Modern brand presence with a polished web experience built for growth.',
    tags: ['Branding', 'Web Design', 'Motion'],
  },
  {
    number: '03',
    name: 'Imex Tires',
    url: 'https://imextires.com',
    domain: 'imextires.com',
    category: 'Business Website',
    description: 'High-performance tire distributor site with product catalogue and dealer locator.',
    tags: ['Web', 'Catalogue', 'SEO'],
  },
  {
    number: '04',
    name: 'Montnexus',
    url: 'https://montnexus.com',
    domain: 'montnexus.com',
    category: 'SaaS Platform',
    description: 'Full-stack digital platform connecting creators, services, and communities.',
    tags: ['SaaS', 'Full-stack', 'React'],
  },
  {
    number: '05',
    name: 'Greek Street Lab',
    url: 'https://greekstreetlab.lovable.app',
    domain: 'greekstreetlab.lovable.app',
    category: 'Web App',
    description: 'A modern web application crafted for an engaging, immersive user experience.',
    tags: ['Web App', 'UI/UX', 'Lovable'],
  },
  {
    number: '06',
    name: 'Alya',
    url: 'https://alya-landing.onrender.com',
    domain: 'alya-landing.onrender.com',
    category: 'Landing Page',
    description: 'Clean, conversion-focused landing page designed to capture and convert.',
    tags: ['Landing Page', 'Design', 'React'],
  },
  {
    number: '07',
    name: 'Paperwurk',
    url: 'https://paperwurk-ae.lovable.app',
    domain: 'paperwurk-ae.lovable.app',
    category: 'Business Web App',
    description: 'Effortless business solutions platform built for the UAE market.',
    tags: ['Web App', 'Business', 'Lovable'],
  },
]

const BEHANCE = [
  {
    src: 'https://www.behance.net/embed/project/227338135?ilo0=1',
    title: 'Paperwork – Creative Solutions',
    category: 'UI Design',
  },
  {
    src: 'https://www.behance.net/embed/project/227337443?ilo0=1',
    title: 'Talk of the Town – Craft',
    category: 'Brand Identity',
  },
]

// Renders a live scaled iframe that fills its container width perfectly
function SitePreview({ url, name }: { url: string; name: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const IFRAME_W = 1440

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setScale(el.offsetWidth / IFRAME_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const IFRAME_H = 900
  const containerH = Math.round(IFRAME_H * scale)

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', height: containerH, width: '100%', backgroundColor: '#0A0A0A' }}
    >
      <iframe
        src={url}
        title={`Preview of ${name}`}
        scrolling="no"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${IFRAME_W}px`,
          height: `${IFRAME_H}px`,
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function ProjectRow({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: '0',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Preview */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0A0A0A',
          order: isEven ? 0 : 1,
        }}
      >
        <SitePreview url={project.url} name={project.name} />

        {/* Hover overlay — sits on top of the preview */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            background: 'rgba(0,0,0,0.55)',
            transition: 'opacity 0.3s',
            textDecoration: 'none',
            zIndex: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0' }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: '1rem',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.5)',
              padding: '10px 28px',
              borderRadius: '2px',
              letterSpacing: '0.06em',
              backdropFilter: 'blur(4px)',
            }}
          >
            Visit {project.domain} ↗
          </span>
        </a>
      </div>

      {/* Info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(40px, 6vw, 72px) clamp(32px, 5vw, 64px)',
          order: isEven ? 1 : 0,
          borderLeft: isEven ? '1px solid rgba(255,255,255,0.08)' : 'none',
          borderRight: isEven ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.15em',
            }}
          >
            {project.number}
          </span>
          <span
            style={{
              width: '32px',
              height: '1px',
              background: 'rgba(255,255,255,0.2)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {project.category}
          </span>
        </div>

        <h3
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 400,
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#FFFFFF',
            lineHeight: 1.1,
            margin: '0 0 20px',
          }}
        >
          {project.name}
        </h3>

        <p
          style={{
            fontFamily: FONT,
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.85,
            margin: '0 0 32px',
            maxWidth: '380px',
          }}
        >
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: FONT,
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '4px 14px',
                borderRadius: '2px',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function OurWork() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const behanceRef = useRef<HTMLDivElement>(null)
  const behanceInView = useInView(behanceRef, { once: true, margin: '-60px' })

  return (
    <section style={{ backgroundColor: '#111111', overflow: 'hidden' }}>

      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          padding: 'clamp(64px, 8vw, 96px) clamp(32px, 6vw, 96px) clamp(40px, 5vw, 64px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Our Work
          </p>
          <h2
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: 400,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Products We&apos;ve Shipped
          </h2>
        </div>
        <p
          style={{
            fontFamily: FONT,
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.8,
            maxWidth: '320px',
            margin: 0,
          }}
        >
          A selection of live projects designed and built end-to-end by our team.
        </p>
      </motion.div>

      {/* Project rows */}
      {PROJECTS.map((project, i) => (
        <ProjectRow key={project.domain} project={project} index={i} />
      ))}

      {/* Behance design work */}
      <div
        ref={behanceRef}
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: 'clamp(56px, 7vw, 96px) clamp(32px, 6vw, 96px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={behanceInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '40px' }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Design Work
          </p>
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: 400,
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Featured on Behance
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={behanceInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          {BEHANCE.map((item, i) => (
            <div
              key={i}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              <iframe
                src={item.src}
                height={316}
                width={404}
                allowFullScreen
                frameBorder={0}
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ display: 'block' }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

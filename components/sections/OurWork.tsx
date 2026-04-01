'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FONT = "var(--font-eb-garamond), 'EB Garamond', Georgia, serif"
const HEADING_FONT = "'The Seasons', Georgia, serif"

const PROJECTS = [
  {
    name: 'Tott Books',
    url: 'https://tottbooks.com',
    domain: 'tottbooks.com',
    category: 'E-commerce',
    description: 'Online bookstore with curated collections and a seamless shopping experience.',
  },
  {
    name: 'Turquoic',
    url: 'https://turquoic.com',
    domain: 'turquoic.com',
    category: 'Brand & Web',
    description: 'Modern brand presence with a polished web experience built for growth.',
  },
  {
    name: 'Imex Tires',
    url: 'https://imextires.com',
    domain: 'imextires.com',
    category: 'Business Website',
    description: 'High-performance tire distributor site with product catalogue and dealer locator.',
  },
  {
    name: 'Montnexus',
    url: 'https://montnexus.com',
    domain: 'montnexus.com',
    category: 'SaaS Platform',
    description: 'Full-stack digital platform connecting creators, services, and communities.',
  },
]

function ProjectCard({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E2E2',
        borderLeft: '1px solid #E2E2E2',
        borderRadius: '2px',
        overflow: 'hidden',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.25s, transform 0.25s, border-left 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'
        el.style.transform = 'translateY(-3px)'
        el.style.borderLeft = '3px solid #111111'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)'
        el.style.transform = 'translateY(0)'
        el.style.borderLeft = '1px solid #E2E2E2'
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          backgroundColor: '#F5F5F5',
          borderBottom: '1px solid #E2E2E2',
          padding: '10px 14px 8px',
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((color, i) => (
            <span
              key={i}
              style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }}
            />
          ))}
        </div>
        {/* URL bar */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E2E2',
            borderRadius: '3px',
            padding: '4px 10px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#999999',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ color: '#28C840', fontSize: '10px' }}>🔒</span>
          {project.domain}
        </div>
      </div>

      {/* Website preview via iframe */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          backgroundColor: '#F9F9F9',
          flexShrink: 0,
        }}
      >
        <iframe
          src={project.url}
          title={`Preview of ${project.name}`}
          scrolling="no"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1280px',
            height: '880px',
            border: 'none',
            transform: 'scale(0.315)',
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        />
        {/* Click overlay — opens site on click */}
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
            background: 'rgba(0,0,0,0.45)',
            transition: 'opacity 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0' }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: '0.95rem',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.6)',
              padding: '8px 20px',
              borderRadius: '2px',
              letterSpacing: '0.04em',
            }}
          >
            Visit site →
          </span>
        </a>
      </div>

      {/* Card body */}
      <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span
          style={{
            fontFamily: FONT,
            fontSize: '0.75rem',
            color: '#999999',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {project.category}
        </span>
        <h3
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 400,
            fontSize: '1.4rem',
            color: '#111111',
            margin: 0,
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            fontFamily: FONT,
            fontSize: '1rem',
            color: '#666666',
            lineHeight: 1.8,
            margin: 0,
            flex: 1,
          }}
        >
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

export function OurWork() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{ backgroundColor: '#F5F5F5', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: '0.78rem',
              color: '#999999',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Our Work
          </p>
          <h2
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#111111',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Products We&apos;ve Shipped
          </h2>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: '#111111',
              marginBottom: '56px',
            }}
          />
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.domain} project={project} index={i} />
          ))}
        </div>

        {/* Behance embeds */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: '0.78rem',
              color: '#999999',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '64px',
              marginBottom: '24px',
            }}
          >
            Design Work
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            {[
              'https://www.behance.net/embed/project/227338135?ilo0=1',
              'https://www.behance.net/embed/project/227337443?ilo0=1',
            ].map((src, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E2E2',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
                  flexShrink: 0,
                }}
              >
                <iframe
                  src={src}
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}

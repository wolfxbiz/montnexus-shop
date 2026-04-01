'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { PROJECTS, BEHANCE } from '@/components/sections/OurWork'

const FONT = "var(--font-eb-garamond), 'EB Garamond', Georgia, serif"
const HEADING_FONT = "'The Seasons', Georgia, serif"
const WHATSAPP_URL = 'https://wa.me/918137871221'

function SitePreview({ screenshot, name }: { screenshot: string; name: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#F0F0F0' }}>
      <Image
        src={screenshot}
        alt={`Screenshot of ${name}`}
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        style={{ objectFit: 'cover', objectPosition: 'top' }}
        priority={false}
      />
    </div>
  )
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{ border: '1px solid #E2E2E2', borderRadius: '2px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', transition: 'box-shadow 0.25s, transform 0.25s, border-left 0.2s' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'; el.style.transform = 'translateY(-3px)'; el.style.borderLeft = '3px solid #111111' }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; el.style.borderLeft = '1px solid #E2E2E2' }}
    >
      {/* Browser chrome */}
      <div style={{ backgroundColor: '#F5F5F5', borderBottom: '1px solid #E2E2E2', padding: '10px 14px 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
          ))}
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E2E2', borderRadius: '3px', padding: '4px 10px', fontFamily: 'monospace', fontSize: '11px', color: '#999999', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#28C840', fontSize: '10px' }}>🔒</span>
          {project.domain}
        </div>
      </div>

      {/* Preview */}
      <div style={{ position: 'relative' }}>
        <SitePreview screenshot={project.screenshot} name={project.name} />
        <a
          href={project.url} target="_blank" rel="noopener noreferrer"
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, background: 'rgba(0,0,0,0.5)', transition: 'opacity 0.2s', textDecoration: 'none', zIndex: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0' }}
        >
          <span style={{ fontFamily: FONT, fontSize: '0.95rem', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.7)', padding: '8px 20px', borderRadius: '2px' }}>Visit site ↗</span>
        </a>
      </div>

      {/* Info */}
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontFamily: FONT, fontSize: '0.72rem', color: '#999999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{project.category}</span>
        <h3 style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: '1.4rem', color: '#111111', margin: 0 }}>{project.name}</h3>
        <p style={{ fontFamily: FONT, fontSize: '0.95rem', color: '#666666', lineHeight: 1.8, margin: 0, flex: 1 }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontFamily: FONT, fontSize: '0.75rem', color: '#999999', border: '1px solid #E2E2E2', padding: '3px 10px', borderRadius: '2px' }}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function WorkPage() {
  return (
    <div style={{ fontFamily: FONT, backgroundColor: '#FFFFFF', color: '#111111', minHeight: '100vh' }}>

      {/* Simple nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #E2E2E2', backdropFilter: 'blur(8px)', padding: '16px clamp(24px, 5vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: HEADING_FONT, fontSize: '1.2rem', color: '#111111', textDecoration: 'none', fontWeight: 400 }}>
          Montnexus
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: FONT, fontSize: '0.9rem', color: '#666666', textDecoration: 'none' }}>About</Link>
          <a
            href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: FONT, fontSize: '0.9rem', color: '#FFFFFF', backgroundColor: '#111111', padding: '8px 20px', borderRadius: '2px', textDecoration: 'none' }}
          >
            Let&apos;s Talk
          </a>
        </div>
      </nav>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ padding: 'clamp(64px, 10vw, 120px) clamp(24px, 6vw, 96px) clamp(48px, 6vw, 80px)', borderBottom: '1px solid #E2E2E2' }}
      >
        <p style={{ fontFamily: FONT, fontSize: '0.78rem', color: '#999999', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Portfolio
        </p>
        <h1 style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: 'clamp(2.4rem, 6vw, 5rem)', color: '#111111', lineHeight: 1.05, margin: '0 0 24px', maxWidth: '700px' }}>
          Products We&apos;ve Shipped
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#666666', lineHeight: 1.8, maxWidth: '520px', margin: '0 0 40px' }}>
          A selection of live projects designed and built end-to-end by our team — websites, web apps, mobile apps and SaaS platforms.
        </p>
        <a
          href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 600, fontSize: '1rem', color: '#FFFFFF', backgroundColor: '#111111', padding: '13px 32px', borderRadius: '2px', textDecoration: 'none' }}
        >
          Start a project with us →
        </a>
      </motion.div>

      {/* Projects grid */}
      <div style={{ padding: 'clamp(48px, 7vw, 96px) clamp(24px, 6vw, 96px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: '32px' }}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* Behance */}
      <div style={{ borderTop: '1px solid #E2E2E2', padding: 'clamp(48px, 7vw, 96px) clamp(24px, 6vw, 96px)' }}>
        <p style={{ fontFamily: FONT, fontSize: '0.78rem', color: '#999999', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>Design Work</p>
        <h2 style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#111111', margin: '0 0 40px' }}>Featured on Behance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '24px' }}>
          {BEHANCE.map((item, i) => (
            <div key={i} style={{ border: '1px solid #E2E2E2', borderRadius: '2px', overflow: 'hidden', position: 'relative', paddingBottom: '78.2%' }}>
              <iframe
                src={item.src}
                allowFullScreen
                frameBorder={0}
                allow="clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ backgroundColor: '#111111', padding: 'clamp(56px, 8vw, 96px) clamp(24px, 6vw, 96px)', textAlign: 'center' }}>
        <p style={{ fontFamily: FONT, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>Work With Us</p>
        <h2 style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#FFFFFF', lineHeight: 1.1, margin: '0 0 20px' }}>
          Let&apos;s build something together
        </h2>
        <p style={{ fontFamily: FONT, fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 40px' }}>
          We&apos;d love to hear about your project. Get in touch and we&apos;ll respond within 4 hours.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 600, fontSize: '1rem', color: '#FFFFFF', backgroundColor: 'transparent', border: '1.5px solid rgba(255,255,255,0.5)', padding: '13px 32px', borderRadius: '2px', textDecoration: 'none' }}>
            View our services →
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 600, fontSize: '1rem', color: '#111111', backgroundColor: '#FFFFFF', padding: '13px 32px', borderRadius: '2px', textDecoration: 'none' }}>
            WhatsApp us
          </a>
        </div>
      </div>
    </div>
  )
}

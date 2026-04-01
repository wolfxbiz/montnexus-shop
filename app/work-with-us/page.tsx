'use client'

import { OurWork } from '@/components/sections/OurWork'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { EnquiryProvider, useEnquiry } from '@/components/work-with-us/EnquiryModal'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Globe,
  Monitor,
  Smartphone,
  Laptop,
  MessageCircle,
  FileText,
  Zap,
  TrendingUp,
  ChevronDown,
  Check,
  X,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_URL = 'https://wa.me/918137871221'
const EMAIL = 'hello@montnexus.com'
const FONT = "var(--font-eb-garamond), 'EB Garamond', Georgia, serif"
const HEADING_FONT = "'The Seasons', Georgia, serif"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  icon: React.ElementType
  name: string
  price: string
  features: string[]
}

interface Step {
  icon: React.ElementType
  number: string
  title: string
  description: string
}

interface PricingTier {
  name: string
  priceRange: string
  description: string
  timeline: string
  popular: boolean
  features: string[]
}

interface ComparisonRow {
  label: string
  me: string
  agency: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
}

interface RetainerPlan {
  name: string
  priceRange: string
  description: string
  features: string[]
  popular: boolean
}

interface FAQ {
  question: string
  answer: string
}

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  description: string
  source: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const services: Service[] = [
  {
    icon: Globe,
    name: 'Website',
    price: 'From $180',
    features: [
      'Custom design',
      'Mobile responsive',
      'CMS integration',
      'SEO setup',
      '1 month support',
    ],
  },
  {
    icon: Monitor,
    name: 'Web Application',
    price: 'From $964',
    features: [
      'Full-stack development',
      'User authentication',
      'Admin dashboard',
      'API integrations',
      'Cloud deployment',
    ],
  },
  {
    icon: Smartphone,
    name: 'Mobile App',
    price: 'From $1,200',
    features: [
      'iOS + Android (Flutter)',
      'Push notifications',
      'Payment integration',
      'App Store submission',
      '3 months support',
    ],
  },
  {
    icon: Laptop,
    name: 'Desktop Software',
    price: 'From $964',
    features: [
      'Windows + macOS',
      'Offline functionality',
      'Auto-updater',
      'Cloud sync',
      'Code-signed installer',
    ],
  },
]

const steps: Step[] = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'You Share Your Idea',
    description: 'Tell us what you want to build. No jargon needed.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'We Send a Fixed Quote',
    description: 'Clear scope, fixed price. No surprises, ever.',
  },
  {
    icon: Zap,
    number: '03',
    title: 'We Build It Fast',
    description: 'AI-assisted development delivers twice as fast as a traditional agency.',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'You Launch & Grow',
    description: 'We stay on as your dedicated tech partner if you want.',
  },
]

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    priceRange: '$180–$600',
    description: 'Websites & landing pages',
    timeline: '2–4 weeks',
    popular: false,
    features: [
      'Custom design',
      'Mobile responsive',
      'Up to 10 pages',
      'Contact form',
      'Basic SEO',
    ],
  },
  {
    name: 'Business',
    priceRange: '$600–$3,600',
    description: 'Web & mobile apps',
    timeline: '4–10 weeks',
    popular: true,
    features: [
      'Full-stack app',
      'User accounts & auth',
      'Admin dashboard',
      'Payment integration',
      'Cloud deployment',
    ],
  },
  {
    name: 'Advanced',
    priceRange: '$3,600–$18,000',
    description: 'SaaS & complex platforms',
    timeline: '2–5 months',
    popular: false,
    features: [
      'Multi-tenant SaaS',
      'Custom integrations',
      'Advanced analytics',
      'Role-based access',
      'Dedicated support',
    ],
  },
  {
    name: 'Enterprise',
    priceRange: '$18,000+',
    description: 'Enterprise systems',
    timeline: '4–8 months',
    popular: false,
    features: [
      'Enterprise architecture',
      'Team collaboration tools',
      'SLA guarantee',
      'On-call support',
      'Quarterly roadmap',
    ],
  },
]

const comparison: ComparisonRow[] = [
  {
    label: 'Communication',
    me: 'Direct access to the team building your product',
    agency: 'Account managers between you and developers',
  },
  {
    label: 'Pricing',
    me: 'Fixed price agreed upfront',
    agency: 'Scope creep and surprise invoices',
  },
  {
    label: 'Speed',
    me: '40% faster delivery with AI-powered workflows',
    agency: 'Slow handoffs between teams',
  },
  {
    label: 'Accountability',
    me: 'A focused studio, fully accountable end-to-end',
    agency: 'Responsibility spread across a team',
  },
  {
    label: 'After launch',
    me: 'Ongoing partner with structured support plans',
    agency: 'Handed off after launch',
  },
]

const testimonials: Testimonial[] = [
  {
    quote:
      'The website completely transformed how customers find us online. Professional, fast, and exactly what we needed.',
    author: 'S. Kumar',
    role: 'Education Business 🌍',
  },
  {
    quote:
      'Got a full web app built for a fraction of what agencies quoted us. Clear communication throughout.',
    author: 'S. Clarke',
    role: 'Food & Lifestyle Brand 🌍',
  },
  {
    quote:
      'Delivered our mobile app on time and within budget. The ongoing maintenance retainer is worth every penny.',
    author: 'A. Al-Rashid',
    role: 'Property Business 🌍',
  },
]

const retainerPlans: RetainerPlan[] = [
  {
    name: 'Essential',
    priceRange: '$42–$90/mo',
    description: 'For websites',
    popular: false,
    features: [
      'Hosting management',
      'Uptime monitoring',
      'Bug fixes',
      'Security updates',
      'Monthly report',
    ],
  },
  {
    name: 'Growth',
    priceRange: '$120–$300/mo',
    description: 'For apps',
    popular: true,
    features: [
      'Everything in Essential',
      'Feature updates',
      'Performance optimisation',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    priceRange: '$900+/mo',
    description: 'For SaaS & enterprise',
    popular: false,
    features: [
      'Everything in Growth',
      'Dedicated hours',
      'SLA guarantee',
      'Infrastructure scaling',
      'Weekly calls',
    ],
  },
]

const faqs: FAQ[] = [
  {
    question: 'How long does a project take?',
    answer:
      'Websites: 2–4 weeks. Web apps: 4–10 weeks. Mobile apps: 6–12 weeks. We give you a fixed timeline upfront and stick to it.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes — we work with clients across the US, UK, UAE, Australia, Malaysia, Singapore and more. All communication is in English. Payments via bank transfer, Stripe, or Wise.',
  },
  {
    question: 'How does payment work?',
    answer:
      '40% upfront to start, 60% on delivery. For larger projects, milestone-based payments are available. No hidden fees, ever.',
  },
  {
    question: 'What if I need changes after delivery?',
    answer:
      'Every project includes a 2-week revision window. After that, the monthly maintenance plan covers ongoing changes and improvements.',
  },
  {
    question: 'Can I see examples of your work?',
    answer:
      "Absolutely — reach out via WhatsApp or fill the form below and we'll share a portfolio tailored to your industry.",
  },
  {
    question: 'Do you sign NDAs or contracts?',
    answer:
      'Yes. Every project starts with a written scope document. NDAs signed on request.',
  },
]

// ─── Shared Utilities ─────────────────────────────────────────────────────────

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function FadeInView({
  children,
  delay = 0,
  className = '',
  slideFrom = 'bottom',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  slideFrom?: 'bottom' | 'left' | 'scale'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const initial =
    slideFrom === 'left'
      ? { opacity: 0, x: -40 }
      : slideFrom === 'scale'
      ? { opacity: 0, scale: 0.95 }
      : { opacity: 0, y: 32 }

  const animate =
    isInView
      ? slideFrom === 'left'
        ? { opacity: 1, x: 0 }
        : slideFrom === 'scale'
        ? { opacity: 1, scale: 1 }
        : { opacity: 1, y: 0 }
      : initial

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: HEADING_FONT,
        color: '#111111',
        fontSize: 'clamp(2rem, 4vw, 3.25rem)',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '0.015em',
      }}
    >
      {children}
    </h2>
  )
}

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        width: '72px',
        backgroundColor: '#E2E2E2',
        marginTop: '20px',
        marginBottom: '48px',
      }}
    />
  )
}

function PopularBadge() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '-13px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        fontFamily: FONT,
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        padding: '3px 14px',
        borderRadius: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      Most Popular
    </div>
  )
}

// ─── WhatsApp SVG ─────────────────────────────────────────────────────────────

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── Section: Nav ─────────────────────────────────────────────────────────────

function StickyNav({ onCta }: { onCta: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Services', id: 'services' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      aria-label="Page navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: scrolled ? '#FFFFFF' : 'transparent',
        borderBottom: scrolled ? '1px solid #E2E2E2' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.05)' : 'none',
        padding: '14px 24px',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Image
          src={scrolled ? '/mnx-logo.png' : '/images/mnx-logo-light.png'}
          alt="Montnexus"
          width={152}
          height={38}
          style={{ objectFit: 'contain', filter: scrolled ? 'brightness(0)' : 'none' }}
          priority
        />

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                fontFamily: FONT,
                fontSize: '1.05rem',
                color: scrolled ? '#111111' : 'rgba(255,255,255,0.9)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? '#555555' : '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? '#111111' : 'rgba(255,255,255,0.9)')}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          onClick={onCta}
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            padding: '8px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
          aria-label="Contact"
        >
          Let&apos;s Talk
        </button>
      </div>
    </motion.nav>
  )
}

// ─── Section: Hero ────────────────────────────────────────────────────────────

function Hero({ onCta }: { onCta: () => void }) {
  const headline = ['We', 'Build', 'Digital', 'Products', 'That', 'Grow', 'Your', 'Business']

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '136px 24px 96px',
        backgroundColor: '#111111',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background mountain image */}
      <Image
        src="/images/hero-mountains.jpg"
        alt=""
        fill
        priority
        aria-hidden="true"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.45,
        }}
      />

      {/* Dark overlay for text legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        @keyframes hbg {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.45); }
          50% { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          width: '100%',
          textAlign: 'center',
        }}
      >

        {/* Headline — staggered word entrance */}
        <h1
          aria-label="We Build Digital Products That Grow Your Business"
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 400,
            lineHeight: 1.13,
            letterSpacing: '0.01em',
            color: '#FFFFFF',
            fontSize: 'clamp(2.6rem, 6vw, 5rem)',
            marginBottom: '32px',
          }}
        >
          {headline.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.25 + i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.8,
            maxWidth: '640px',
            margin: '0 auto 44px',
          }}
        >
          Websites, web apps, mobile apps and desktop software — built by a specialist
          studio, powered by AI, delivered fast.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.45, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={onCta}
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: '1.15rem',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '2px',
              padding: '14px 36px',
              cursor: 'pointer',
              transition: 'background-color 0.18s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
            aria-label="Get a Free Quote"
          >
            Get a Free Quote
          </button>

          <button
            onClick={() => scrollTo('services')}
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: '1.15rem',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '2px',
              padding: '14px 36px',
              cursor: 'pointer',
              transition: 'background-color 0.18s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
            aria-label="See Our Services"
          >
            See Our Services
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: '1.15rem',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '2px solid rgba(255,255,255,0.8)',
              borderRadius: '2px',
              padding: '12px 36px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.18s, color 0.18s, border-color 0.18s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.borderColor = '#FFFFFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
            }}
            aria-label="Let's Talk on WhatsApp"
          >
            Let&apos;s Talk on WhatsApp
          </a>
        </motion.div>

        {/* Trust indicators */}
      </div>
    </section>
  )
}

// ─── Section: Social Proof Bar ────────────────────────────────────────────────

function SocialProofBar() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      style={{ backgroundColor: '#F5F5F5', padding: '22px 24px' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: '1.1rem',
            color: '#666666',
            lineHeight: 1.9,
          }}
        >
          Trusted by businesses across{' '}
          🇦🇪 UAE &nbsp;·&nbsp;
          🇬🇧 UK &nbsp;·&nbsp;
          🇺🇸 USA &nbsp;·&nbsp;
          🇦🇺 Australia &nbsp;·&nbsp;
          🇲🇾 Malaysia &nbsp;·&nbsp;
          🇸🇬 Singapore
        </p>
      </div>
    </motion.section>
  )
}

// ─── Section: Services ────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section
      id="services"
      style={{ backgroundColor: '#FFFFFF', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>What We Build</SectionTitle>
          <Divider />
        </FadeInView>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <FadeInView key={i} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E2E2',
                    borderLeft: '1px solid #E2E2E2',
                    borderRadius: '2px',
                    padding: '32px',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
                    transition: 'box-shadow 0.25s, transform 0.25s, border-left 0.2s',
                    cursor: 'default',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.borderLeft = '3px solid #111111'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderLeft = '1px solid #E2E2E2'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: 'rgba(0,0,0,0.07)',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} color="#111111" />
                    </div>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        padding: '4px 12px',
                        borderRadius: '2px',
                      }}
                    >
                      {service.price}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: HEADING_FONT,
                      fontWeight: 400,
                      fontSize: '1.5rem',
                      color: '#111111',
                      marginBottom: '16px',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {service.name}
                  </h3>

                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.features.map((feat, j) => (
                      <li
                        key={j}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontFamily: FONT,
                          fontSize: '1.05rem',
                          color: '#666666',
                          lineHeight: 1.75,
                        }}
                      >
                        <Check size={15} color="#111111" style={{ flexShrink: 0, marginTop: '4px' }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInView>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section: How It Works ────────────────────────────────────────────────────

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{ backgroundColor: '#F5F5F5', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>How We Work Together</SectionTitle>
          <Divider />
        </FadeInView>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            position: 'relative',
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeInView key={i} delay={i * 0.12} slideFrom="left">
                <div style={{ position: 'relative' }}>
                  {/* Decorative number */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '-8px',
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: '6.5rem',
                      lineHeight: 1,
                      color: '#111111',
                      opacity: 0.06,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E2E2',
                      borderRadius: '2px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={22} color="#111111" />
                  </div>

                  <h3
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      fontFamily: HEADING_FONT,
                      fontWeight: 400,
                      fontSize: '1.25rem',
                      color: '#111111',
                      marginBottom: '10px',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      fontFamily: FONT,
                      fontSize: '1.05rem',
                      color: '#666666',
                      lineHeight: 1.8,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </FadeInView>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Pricing ─────────────────────────────────────────────────────────

function PricingSection({ onCta }: { onCta: () => void }) {
  return (
    <section
      id="pricing"
      style={{ backgroundColor: '#FFFFFF', padding: '96px 24px' }}
    >
      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Simple, Transparent Pricing</SectionTitle>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#666666',
              lineHeight: 1.8,
              marginTop: '12px',
            }}
          >
            No hidden fees. No hourly billing surprises. A fixed price agreed before a
            single line of code is written.
          </p>
          <Divider />
        </FadeInView>

        <div className="pricing-grid">
          {pricingTiers.map((tier, i) => (
            <FadeInView key={i} delay={i * 0.08} slideFrom="scale" className="h-full">
              <div
                style={{
                  position: 'relative',
                  backgroundColor: tier.popular ? '#F5F5F5' : '#FFFFFF',
                  border: tier.popular ? '2px solid #111111' : '1px solid #E2E2E2',
                  borderRadius: '4px',
                  padding: '32px 28px',
                  paddingTop: tier.popular ? '44px' : '32px',
                  boxShadow: tier.popular
                    ? '0 8px 32px rgba(0,0,0,0.1)'
                    : '0 2px 16px rgba(28,25,23,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {tier.popular && <PopularBadge />}

                {/* Tier label */}
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: tier.popular ? '#111111' : '#111111',
                    marginBottom: '16px',
                  }}
                >
                  {tier.name}
                </div>

                {/* Price */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontFamily: HEADING_FONT,
                      fontWeight: 400,
                      fontSize: '1.55rem',
                      color: '#111111',
                      lineHeight: 1.3,
                    }}
                  >
                    {tier.priceRange}
                  </div>
                </div>

                {/* Description + timeline */}
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '0.95rem',
                    color: '#666666',
                    marginBottom: '4px',
                  }}
                >
                  {tier.description}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    color: '#111111',
                    marginBottom: '24px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid #E2E2E2',
                  }}
                >
                  {tier.timeline}
                </div>

                {/* Features */}
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flexGrow: 1,
                  }}
                >
                  {tier.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: FONT,
                        fontSize: '0.98rem',
                        color: '#666666',
                        lineHeight: 1.7,
                      }}
                    >
                      <Check size={13} color="#111111" style={{ flexShrink: 0, marginTop: '5px' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={onCta}
                  style={{
                    marginTop: '32px',
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.98rem',
                    backgroundColor: tier.popular ? '#111111' : 'transparent',
                    color: tier.popular ? '#FFFFFF' : '#111111',
                    border: '1.5px solid #111111',
                    borderRadius: '2px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.18s, color 0.18s',
                    width: '100%',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#111111'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tier.popular ? '#111111' : 'transparent'
                    e.currentTarget.style.color = tier.popular ? '#FFFFFF' : '#111111'
                  }}
                >
                  Get Started
                </button>
              </div>
            </FadeInView>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Section: Why Choose Me ───────────────────────────────────────────────────

function WhyMeSection() {
  return (
    <section style={{ backgroundColor: '#F5F5F5', padding: '96px 24px' }}>
      <style>{`
        .cmp-table { border-radius: 2px; overflow: hidden; border: 1px solid #E2E2E2; }
        .cmp-header { display: grid; grid-template-columns: 1fr 2fr 2fr; background-color: #FFFFFF; }
        .cmp-header-empty { padding: 16px 20px; }
        .cmp-header-us { padding: 16px 20px; font-weight: 700; font-size: 1.1rem; color: #111111; border-left: 1px solid #E2E2E2; }
        .cmp-header-agency { padding: 16px 20px; font-weight: 700; font-size: 1.1rem; color: #666666; border-left: 1px solid #E2E2E2; }
        .cmp-row { display: grid; grid-template-columns: 1fr 2fr 2fr; border-top: 1px solid #E2E2E2; background-color: #FFFFFF; }
        .cmp-label { padding: 16px 20px; font-weight: 600; font-size: 0.95rem; color: #111111; display: flex; align-items: center; }
        .cmp-me { padding: 14px 20px; font-size: 1rem; color: #666666; line-height: 1.75; border-left: 1px solid #E2E2E2; display: flex; align-items: flex-start; gap: 10px; }
        .cmp-agency { padding: 14px 20px; font-size: 1rem; color: #666666; line-height: 1.75; border-left: 1px solid #E2E2E2; display: flex; align-items: flex-start; gap: 10px; }
        @media (max-width: 600px) {
          .cmp-header { display: none; }
          .cmp-row { grid-template-columns: 1fr 1fr; }
          .cmp-label { grid-column: 1 / -1; background-color: #F0F0F0; border-bottom: 1px solid #E2E2E2; font-size: 0.88rem; padding: 10px 14px; }
          .cmp-me { border-left: none; padding: 12px 14px; font-size: 0.88rem; line-height: 1.5; }
          .cmp-agency { padding: 12px 14px; font-size: 0.88rem; line-height: 1.5; }
          .cmp-col-header { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
          .cmp-col-header-us { color: #111111; }
          .cmp-col-header-agency { color: #999999; }
        }
        @media (min-width: 601px) {
          .cmp-col-header { display: none; }
        }
      `}</style>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Why Work With Us Over a Larger Agency?</SectionTitle>
          <Divider />
        </FadeInView>

        <FadeInView delay={0.1}>
          <div className="cmp-table">
            {/* Header row — hidden on mobile */}
            <div className="cmp-header">
              <div className="cmp-header-empty" />
              <div className="cmp-header-us" style={{ fontFamily: FONT }}>Working with us</div>
              <div className="cmp-header-agency" style={{ fontFamily: FONT }}>Large agency</div>
            </div>

            {comparison.map((row, i) => (
              <div key={i} className="cmp-row">
                <div className="cmp-label" style={{ fontFamily: FONT }}>{row.label}</div>
                <div className="cmp-me" style={{ fontFamily: FONT }}>
                  <span className="cmp-col-header cmp-col-header-us">Working with us</span>
                  <Check size={15} color="#111111" style={{ flexShrink: 0, marginTop: '4px' }} />
                  {row.me}
                </div>
                <div className="cmp-agency" style={{ fontFamily: FONT }}>
                  <span className="cmp-col-header cmp-col-header-agency">Large agency</span>
                  <X size={15} color="#111111" style={{ flexShrink: 0, marginTop: '4px' }} />
                  {row.agency}
                </div>
              </div>
            ))}
          </div>
        </FadeInView>

        {/* Statement */}
        <FadeInView delay={0.25}>
          <div
            style={{
              marginTop: '28px',
              backgroundColor: '#111111',
              borderRadius: '2px',
              padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 44px)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.65rem)',
                color: '#FFFFFF',
                lineHeight: 1.7,
              }}
            >
              &ldquo;You get a focused studio that treats your project like their most
              important one.&rdquo;
            </p>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}

// ─── Section: Testimonials ────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>What Clients Say</SectionTitle>
          <Divider />
        </FadeInView>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {testimonials.map((t, i) => (
            <FadeInView key={i} delay={i * 0.1}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E2E2',
                  borderRadius: '2px',
                  padding: '36px 32px',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative quote */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '20px',
                    fontFamily: FONT,
                    fontSize: '9rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: '#111111',
                    opacity: 0.045,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '18px' }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: '#111111', fontSize: '1.1rem' }}>
                      ★
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: '1.1rem',
                    color: '#111111',
                    lineHeight: 1.8,
                    flexGrow: 1,
                    marginBottom: '24px',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#111111',
                    }}
                  >
                    {t.author}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: '0.95rem',
                      color: '#666666',
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Maintenance Retainers ──────────────────────────────────────────

function RetainersSection({ onCta }: { onCta: () => void }) {
  return (
    <section style={{ backgroundColor: '#F5F5F5', padding: '96px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Stay Protected After Launch</SectionTitle>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#666666',
              lineHeight: 1.8,
              marginTop: '12px',
            }}
          >
            Every project comes with an optional monthly plan. Most clients never
            worry about their tech again.
          </p>
          <Divider />
        </FadeInView>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {retainerPlans.map((plan, i) => (
            <FadeInView key={i} delay={i * 0.1}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  border: plan.popular ? '2px solid #111111' : '1px solid #E2E2E2',
                  borderRadius: '2px',
                  padding: '32px',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {plan.popular && <PopularBadge />}

                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    marginBottom: '8px',
                    marginTop: plan.popular ? '8px' : '0',
                  }}
                >
                  {plan.name}
                </div>

                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: '1.6rem',
                    color: '#111111',
                    marginBottom: '4px',
                    letterSpacing: '0.01em',
                  }}
                >
                  {plan.priceRange}
                </div>

                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '1rem',
                    color: '#666666',
                    marginBottom: '24px',
                  }}
                >
                  {plan.description}
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    margin: '0 0 auto',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: FONT,
                        fontSize: '1.02rem',
                        color: '#666666',
                        lineHeight: 1.75,
                      }}
                    >
                      <Check size={14} color="#111111" style={{ flexShrink: 0, marginTop: '5px' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onCta}
                  style={{
                    marginTop: '28px',
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '1rem',
                    backgroundColor: plan.popular ? '#111111' : 'transparent',
                    color: plan.popular ? '#FFFFFF' : '#111111',
                    border: '2px solid #111111',
                    borderRadius: '2px',
                    padding: '11px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.18s, color 0.18s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#111111'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = plan.popular ? '#111111' : 'transparent'
                    e.currentTarget.style.color = plan.popular ? '#FFFFFF' : '#111111'
                  }}
                >
                  Get Started
                </button>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: FAQ ─────────────────────────────────────────────────────────────

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      style={{ backgroundColor: '#FFFFFF', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Common Questions</SectionTitle>
          <Divider />
        </FadeInView>

        <div>
          {faqs.map((faq, i) => (
            <FadeInView key={i} delay={i * 0.05}>
              <div style={{ borderBottom: '1px solid #E2E2E2' }}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-${i}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '22px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: 600,
                      fontSize: '1.15rem',
                      color: '#111111',
                      lineHeight: 1.5,
                    }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown size={20} color="#111111" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: '1.08rem',
                          color: '#666666',
                          lineHeight: 1.85,
                          paddingBottom: '22px',
                        }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Contact ─────────────────────────────────────────────────────────

const inputBaseStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '1.1rem',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E2E2',
  color: '#111111',
  padding: '12px 16px',
  borderRadius: '2px',
  width: '100%',
  outline: 'none',
  lineHeight: 1.6,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: '0.72rem',
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color: '#666666',
  marginBottom: '6px',
}

function ContactSection({ onCta }: { onCta: () => void }) {
  return (
    <section
      id="contact"
      style={{ backgroundColor: '#F5F5F5', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <FadeInView>
          <SectionTitle>Let&apos;s Build Something Together</SectionTitle>
          <p style={{ fontFamily: FONT, fontSize: '1.15rem', color: '#666666', lineHeight: 1.8, marginTop: '12px' }}>
            Share your project details and we will get back to you within 4 hours.
          </p>
          <Divider />
        </FadeInView>

        <FadeInView delay={0.1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '48px' }}>
            <button
              onClick={onCta}
              style={{
                fontFamily: FONT, fontWeight: 600, fontSize: '1.15rem',
                backgroundColor: '#111111', color: '#FFFFFF',
                border: 'none', borderRadius: '2px', padding: '15px 40px',
                cursor: 'pointer', transition: 'background-color 0.18s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
            >
              Send Us Your Project Details →
            </button>
            <a
              href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: FONT, fontWeight: 600, fontSize: '1.15rem',
                backgroundColor: '#25D366', color: '#FFFFFF',
                textDecoration: 'none', borderRadius: '2px', padding: '15px 32px',
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                transition: 'background-color 0.18s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1daa52')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
            >
              <WhatsAppIcon size={20} /> Chat on WhatsApp
            </a>
          </div>
        </FadeInView>

        <FadeInView delay={0.2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#666666', marginBottom: '6px' }}>Email</p>
              <a href={`mailto:${EMAIL}`} style={{ fontFamily: FONT, fontSize: '1.05rem', color: '#111111', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >{EMAIL}</a>
            </div>
            <div style={{ width: '1px', backgroundColor: '#E2E2E2' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#666666', marginBottom: '6px' }}>Response time</p>
              <p style={{ fontFamily: FONT, fontSize: '1.05rem', color: '#111111' }}>⚡ Under 4 hours</p>
            </div>
            <div style={{ width: '1px', backgroundColor: '#E2E2E2' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#666666', marginBottom: '6px' }}>Availability</p>
              <p style={{ fontFamily: FONT, fontSize: '1.05rem', color: '#111111' }}>Mon–Sat, 9am–9pm GMT+5:30</p>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}

// ─── Section: Footer ──────────────────────────────────────────────────────────

function Footer() {
  const links = [
    { label: 'Services', id: 'services' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <footer style={{ backgroundColor: '#111111', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#FFFFFF',
              lineHeight: 1.7,
            }}
          >
            Crafting digital products that matter.
          </p>

          <nav
            aria-label="Footer navigation"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 20px',
              justifyContent: 'center',
            }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  fontFamily: FONT,
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.65)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')
                }
              >
                {link.label}
              </button>
            ))}
          </nav>

          <p
            style={{
              fontFamily: FONT,
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'right',
            }}
          >
            © 2026 · All rights reserved
          </p>
        </div>

        <p
          style={{
            fontFamily: FONT,
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.32)',
            textAlign: 'center',
            marginTop: '24px',
          }}
        >
          🔒 This page is private. Please do not share the URL.
        </p>
      </div>
    </footer>
  )
}

// ─── Section: Montnexus Main Site ────────────────────────────────────────────

function MontnexusBanner() {
  return (
    <section style={{ backgroundColor: '#111111', padding: '72px 24px' }}>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Image
          src="/mnx-logo.png"
          alt="Montnexus"
          width={180}
          height={44}
          style={{ objectFit: 'contain', opacity: 0.9 }}
        />

        <h2
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 400,
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#FFFFFF',
            lineHeight: 1.25,
            letterSpacing: '0.01em',
          }}
        >
          Explore the Montnexus Marketplace
        </h2>

        <p
          style={{
            fontFamily: FONT,
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.8,
            maxWidth: '520px',
          }}
        >
          Browse our curated collection of UI kits, code templates, icon sets, and
          digital tools — built for designers, developers, and indie creators.
        </p>

        <a
          href="/"
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: '1.05rem',
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            border: '1.5px solid rgba(255,255,255,0.45)',
            borderRadius: '2px',
            padding: '12px 32px',
            textDecoration: 'none',
            marginTop: '8px',
            transition: 'border-color 0.18s, background-color 0.18s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFFFFF'
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Visit Montnexus &rarr;
        </a>
      </div>
    </section>
  )
}

// ─── Floating WhatsApp Button ─────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 40,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        animation: 'wa-pulse 3s ease-in-out infinite',
        transition: 'transform 0.2s',
        color: '#FFFFFF',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}

// ─── Page inner (needs EnquiryContext) ───────────────────────────────────────

function PageContent() {
  const { open } = useEnquiry()
  return (
    <div
      style={{
        fontFamily: FONT,
        backgroundColor: '#FFFFFF',
        color: '#111111',
        overflowX: 'hidden',
      }}
    >
      <StickyNav onCta={open} />

      <main>
        <Hero onCta={open} />
        <SocialProofBar />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection onCta={open} />
        <WhyMeSection />
        <TestimonialsSection />
        <OurWork />
        <RetainersSection onCta={open} />
        <FAQSection />
        <ContactSection onCta={open} />
      </main>

      <MontnexusBanner />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartPage() {
  return (
    <EnquiryProvider>
      <PageContent />
    </EnquiryProvider>
  )
}

'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
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
    price: 'From ₹15,000 / $180',
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
    price: 'From ₹80,000 / $964',
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
    price: 'From ₹1,00,000 / $1,200',
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
    price: 'From ₹80,000 / $964',
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
    priceRange: '₹15,000–₹50,000\n$180–$600',
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
    priceRange: '₹50,000–₹3,00,000\n$600–$3,600',
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
    priceRange: '₹3,00,000–₹15,00,000\n$3,600–$18,000',
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
    priceRange: '₹15,00,000+\n$18,000+',
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
    priceRange: '₹3,500–₹7,500/mo',
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
    priceRange: '₹10,000–₹25,000/mo',
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
    priceRange: '₹75,000+/mo',
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
        color: '#1B2A4A',
        fontSize: 'clamp(2rem, 4vw, 3.25rem)',
        fontWeight: 700,
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
        backgroundColor: '#E7E2D9',
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
        backgroundColor: '#C45C1A',
        color: '#FAF8F4',
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

function StickyNav() {
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
        backgroundColor: scrolled ? '#FAF8F4' : 'transparent',
        borderBottom: scrolled ? '1px solid #E7E2D9' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(28,25,23,0.06)' : 'none',
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
          src="/mnx-logo.png"
          alt="Montnexus"
          width={152}
          height={38}
          style={{ filter: 'brightness(0)', objectFit: 'contain' }}
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
                color: '#1B2A4A',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C45C1A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1B2A4A')}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo('contact')}
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: '#C45C1A',
            color: '#FAF8F4',
            border: 'none',
            borderRadius: '2px',
            padding: '8px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a04a14')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C45C1A')}
          aria-label="Contact"
        >
          Let&apos;s Talk
        </button>
      </div>
    </motion.nav>
  )
}

// ─── Section: Hero ────────────────────────────────────────────────────────────

function Hero() {
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
        backgroundColor: '#FAF8F4',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(27,42,74,0.045) 0%, transparent 68%)',
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

      {/* Animated soft blob */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '600px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(196,92,26,0.06) 0%, transparent 70%)',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'hbg 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(196,92,26,0.08)',
            border: '1px solid rgba(196,92,26,0.2)',
            color: '#C45C1A',
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: '2px',
            marginBottom: '32px',
          }}
        >
          Specialist Studio · AI-Powered · Global Clients
        </motion.div>

        {/* Headline — staggered word entrance */}
        <h1
          aria-label="We Build Digital Products That Grow Your Business"
          style={{
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            lineHeight: 1.13,
            letterSpacing: '0.01em',
            color: '#1B2A4A',
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
            color: '#57534E',
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
            onClick={() => scrollTo('services')}
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: '1.15rem',
              backgroundColor: '#1B2A4A',
              color: '#FAF8F4',
              border: 'none',
              borderRadius: '2px',
              padding: '14px 36px',
              cursor: 'pointer',
              transition: 'background-color 0.18s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#253d6b')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1B2A4A')}
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
              color: '#1B2A4A',
              border: '2px solid #1B2A4A',
              borderRadius: '2px',
              padding: '12px 36px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.18s, color 0.18s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1B2A4A'
              e.currentTarget.style.color = '#FAF8F4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#1B2A4A'
            }}
            aria-label="Let's Talk on WhatsApp"
          >
            Let&apos;s Talk on WhatsApp
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 32px',
            justifyContent: 'center',
          }}
        >
          {[
            '10+ projects delivered',
            'Global clients',
            'Fast turnaround',
            'Fixed price quotes',
          ].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontSize: '1rem',
                color: '#57534E',
              }}
            >
              <span style={{ color: '#1A7F5A' }}>✓</span> {item}
            </span>
          ))}
        </motion.div>
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
      style={{ backgroundColor: '#F3F0EA', padding: '22px 24px' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: FONT,
            fontSize: '1.1rem',
            color: '#57534E',
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
      style={{ backgroundColor: '#FAF8F4', padding: '96px 24px' }}
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
                    border: '1px solid #E7E2D9',
                    borderLeft: '1px solid #E7E2D9',
                    borderRadius: '2px',
                    padding: '32px',
                    boxShadow: '0 2px 20px rgba(28,25,23,0.06)',
                    transition: 'box-shadow 0.25s, transform 0.25s, border-left 0.2s',
                    cursor: 'default',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(28,25,23,0.13)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.borderLeft = '3px solid #1B2A4A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 20px rgba(28,25,23,0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderLeft = '1px solid #E7E2D9'
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
                        backgroundColor: 'rgba(27,42,74,0.07)',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} color="#1B2A4A" />
                    </div>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        backgroundColor: '#C45C1A',
                        color: '#FAF8F4',
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
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      color: '#1B2A4A',
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
                          color: '#57534E',
                          lineHeight: 1.75,
                        }}
                      >
                        <Check size={15} color="#1A7F5A" style={{ flexShrink: 0, marginTop: '4px' }} />
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
      style={{ backgroundColor: '#F3F0EA', padding: '96px 24px' }}
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
                      color: '#1B2A4A',
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
                      border: '1px solid #E7E2D9',
                      borderRadius: '2px',
                      boxShadow: '0 2px 12px rgba(28,25,23,0.06)',
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={22} color="#1B2A4A" />
                  </div>

                  <h3
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      fontFamily: HEADING_FONT,
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: '#1B2A4A',
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
                      color: '#57534E',
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

function PricingSection() {
  return (
    <section
      id="pricing"
      style={{ backgroundColor: '#FAF8F4', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Simple, Transparent Pricing</SectionTitle>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#57534E',
              lineHeight: 1.8,
              marginTop: '12px',
            }}
          >
            No hidden fees. No hourly billing surprises. A fixed price agreed before a
            single line of code is written.
          </p>
          <Divider />
        </FadeInView>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
          className="md:grid md:grid-cols-4 md:overflow-x-visible"
        >
          {pricingTiers.map((tier, i) => (
            <FadeInView key={i} delay={i * 0.08} slideFrom="scale">
              <div
                style={{
                  position: 'relative',
                  backgroundColor: tier.popular ? 'rgba(27,42,74,0.03)' : '#FFFFFF',
                  border: tier.popular ? '2px solid #1B2A4A' : '1px solid #E7E2D9',
                  borderRadius: '2px',
                  padding: '28px 24px',
                  paddingTop: tier.popular ? '40px' : '28px',
                  marginTop: tier.popular ? '-8px' : '0',
                  boxShadow: '0 2px 20px rgba(28,25,23,0.06)',
                  minWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {tier.popular && <PopularBadge />}

                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C45C1A',
                    marginBottom: '8px',
                  }}
                >
                  {tier.name}
                </div>

                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: '#1B2A4A',
                    lineHeight: 1.35,
                    marginBottom: '4px',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {tier.priceRange}
                </div>

                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '1rem',
                    color: '#57534E',
                    marginBottom: '6px',
                  }}
                >
                  {tier.description}
                </div>

                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    color: '#C45C1A',
                    marginBottom: '22px',
                  }}
                >
                  Timeline: {tier.timeline}
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    margin: '0 0 auto',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
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
                        fontSize: '1rem',
                        color: '#57534E',
                        lineHeight: 1.75,
                      }}
                    >
                      <Check size={14} color="#1A7F5A" style={{ flexShrink: 0, marginTop: '5px' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollTo('contact')}
                  style={{
                    marginTop: '28px',
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '1rem',
                    backgroundColor: tier.popular ? '#1B2A4A' : 'transparent',
                    color: tier.popular ? '#FAF8F4' : '#1B2A4A',
                    border: '2px solid #1B2A4A',
                    borderRadius: '2px',
                    padding: '11px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.18s, color 0.18s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B2A4A'
                    e.currentTarget.style.color = '#FAF8F4'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tier.popular ? '#1B2A4A' : 'transparent'
                    e.currentTarget.style.color = tier.popular ? '#FAF8F4' : '#1B2A4A'
                  }}
                >
                  Get Started
                </button>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.35}>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '0.98rem',
              color: '#57534E',
              textAlign: 'center',
              marginTop: '32px',
            }}
          >
            🌍 Working with a US, UK or Australian team? International rates apply —
            typically 1.5–2× the base price.
          </p>
        </FadeInView>
      </div>
    </section>
  )
}

// ─── Section: Why Choose Me ───────────────────────────────────────────────────

function WhyMeSection() {
  return (
    <section style={{ backgroundColor: '#F3F0EA', padding: '96px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Why Work With Us Over a Larger Agency?</SectionTitle>
          <Divider />
        </FadeInView>

        <FadeInView delay={0.1}>
          <div
            style={{
              borderRadius: '2px',
              overflow: 'hidden',
              border: '1px solid #E7E2D9',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 2fr',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ padding: '16px 20px' }} />
              <div
                style={{
                  padding: '16px 20px',
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#1A7F5A',
                  borderLeft: '1px solid #E7E2D9',
                }}
              >
                Working with us
              </div>
              <div
                style={{
                  padding: '16px 20px',
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#57534E',
                  borderLeft: '1px solid #E7E2D9',
                }}
              >
                Large agency
              </div>
            </div>

            {comparison.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 2fr',
                  borderTop: '1px solid #E7E2D9',
                  backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAF8F4',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#1B2A4A',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    padding: '14px 20px',
                    fontFamily: FONT,
                    fontSize: '1rem',
                    color: '#57534E',
                    lineHeight: 1.75,
                    borderLeft: '1px solid #E7E2D9',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <Check size={15} color="#1A7F5A" style={{ flexShrink: 0, marginTop: '4px' }} />
                  {row.me}
                </div>
                <div
                  style={{
                    padding: '14px 20px',
                    fontFamily: FONT,
                    fontSize: '1rem',
                    color: '#57534E',
                    lineHeight: 1.75,
                    borderLeft: '1px solid #E7E2D9',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <X size={15} color="#C45C1A" style={{ flexShrink: 0, marginTop: '4px' }} />
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
              backgroundColor: '#1B2A4A',
              borderRadius: '2px',
              padding: '40px 44px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 'clamp(1.2rem, 2.5vw, 1.65rem)',
                color: '#FAF8F4',
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
    <section style={{ backgroundColor: '#FAF8F4', padding: '96px 24px' }}>
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
                  border: '1px solid #E7E2D9',
                  borderRadius: '2px',
                  padding: '36px 32px',
                  boxShadow: '0 2px 20px rgba(28,25,23,0.06)',
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
                    color: '#1B2A4A',
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
                    <span key={j} style={{ color: '#C45C1A', fontSize: '1.1rem' }}>
                      ★
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: '1.1rem',
                    color: '#1C1917',
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
                      color: '#1B2A4A',
                    }}
                  >
                    {t.author}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: '0.95rem',
                      color: '#57534E',
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

function RetainersSection() {
  return (
    <section style={{ backgroundColor: '#F3F0EA', padding: '96px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Stay Protected After Launch</SectionTitle>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#57534E',
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
                  border: plan.popular ? '2px solid #1B2A4A' : '1px solid #E7E2D9',
                  borderRadius: '2px',
                  padding: '32px',
                  boxShadow: '0 2px 20px rgba(28,25,23,0.06)',
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
                    color: '#C45C1A',
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
                    color: '#1B2A4A',
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
                    color: '#57534E',
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
                        color: '#57534E',
                        lineHeight: 1.75,
                      }}
                    >
                      <Check size={14} color="#1A7F5A" style={{ flexShrink: 0, marginTop: '5px' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollTo('contact')}
                  style={{
                    marginTop: '28px',
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '1rem',
                    backgroundColor: plan.popular ? '#1B2A4A' : 'transparent',
                    color: plan.popular ? '#FAF8F4' : '#1B2A4A',
                    border: '2px solid #1B2A4A',
                    borderRadius: '2px',
                    padding: '11px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.18s, color 0.18s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B2A4A'
                    e.currentTarget.style.color = '#FAF8F4'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = plan.popular ? '#1B2A4A' : 'transparent'
                    e.currentTarget.style.color = plan.popular ? '#FAF8F4' : '#1B2A4A'
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
      style={{ backgroundColor: '#FAF8F4', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Common Questions</SectionTitle>
          <Divider />
        </FadeInView>

        <div>
          {faqs.map((faq, i) => (
            <FadeInView key={i} delay={i * 0.05}>
              <div style={{ borderBottom: '1px solid #E7E2D9' }}>
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
                      color: '#1B2A4A',
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
                    <ChevronDown size={20} color="#1B2A4A" />
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
                          color: '#57534E',
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
  backgroundColor: '#FAF8F4',
  border: '1px solid #E7E2D9',
  color: '#1C1917',
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
  color: '#57534E',
  marginBottom: '6px',
}

function ContactSection() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    description: '',
    source: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Replace with your actual API endpoint
    await new Promise((r) => setTimeout(r, 1100))
    setSubmitted(true)
    setLoading(false)
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#1B2A4A')
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#E7E2D9')

  return (
    <section
      id="contact"
      style={{ backgroundColor: '#F3F0EA', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <FadeInView>
          <SectionTitle>Let&apos;s Build Something Together</SectionTitle>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#57534E',
              lineHeight: 1.8,
              marginTop: '12px',
            }}
          >
            Tell us about your project and we will get back to you within 4 hours.
          </p>
          <Divider />
        </FadeInView>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'start',
          }}
        >
          {/* ── Form ── */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '64px 0', textAlign: 'center' }}
              >
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: '1.4rem',
                    color: '#1A7F5A',
                    lineHeight: 1.7,
                  }}
                >
                  ✅ Received. We will be in touch within 4 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="cf-name" style={labelStyle}>Full Name *</label>
                    <input
                      id="cf-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={set('name')}
                      style={inputBaseStyle}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-email" style={labelStyle}>Email *</label>
                    <input
                      id="cf-email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={set('email')}
                      style={inputBaseStyle}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-phone" style={labelStyle}>WhatsApp / Phone</label>
                  <input
                    id="cf-phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={set('phone')}
                    style={inputBaseStyle}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="cf-service" style={labelStyle}>Service Interested In</label>
                    <select
                      id="cf-service"
                      value={form.service}
                      onChange={set('service')}
                      style={inputBaseStyle}
                      onFocus={focus}
                      onBlur={blur}
                    >
                      <option value="">Select a service</option>
                      <option>Website</option>
                      <option>Web Application</option>
                      <option>Mobile App</option>
                      <option>Desktop Software</option>
                      <option>Maintenance Retainer</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cf-budget" style={labelStyle}>Budget Range</label>
                    <select
                      id="cf-budget"
                      value={form.budget}
                      onChange={set('budget')}
                      style={inputBaseStyle}
                      onFocus={focus}
                      onBlur={blur}
                    >
                      <option value="">Select budget</option>
                      <option>Under $500</option>
                      <option>$500–$3,000</option>
                      <option>$3,000–$15,000</option>
                      <option>$15,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-description" style={labelStyle}>Project Description *</label>
                  <textarea
                    id="cf-description"
                    required
                    rows={5}
                    placeholder="Tell us what you want to build..."
                    value={form.description}
                    onChange={set('description')}
                    style={{ ...inputBaseStyle, resize: 'vertical' }}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>

                <div>
                  <label htmlFor="cf-source" style={labelStyle}>How Did You Find Me?</label>
                  <select
                    id="cf-source"
                    value={form.source}
                    onChange={set('source')}
                    style={inputBaseStyle}
                    onFocus={focus}
                    onBlur={blur}
                  >
                    <option value="">Select an option</option>
                    <option>Google</option>
                    <option>LinkedIn</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>Referral</option>
                    <option>Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '1.15rem',
                    backgroundColor: loading ? '#a04a14' : '#C45C1A',
                    color: '#FAF8F4',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '15px 24px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.18s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#a04a14'
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#C45C1A'
                  }}
                >
                  {loading ? 'Sending…' : 'Send My Project Details →'}
                </button>
              </form>
            )}
          </div>

          {/* ── Right side info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FadeInView delay={0.2}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: '1.15rem',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  padding: '18px 24px',
                  transition: 'background-color 0.18s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1daa52')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
              >
                <WhatsAppIcon size={24} />
                Chat on WhatsApp
              </a>
            </FadeInView>

            <FadeInView delay={0.3}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E2D9',
                  borderRadius: '2px',
                  padding: '22px 24px',
                  boxShadow: '0 2px 20px rgba(28,25,23,0.06)',
                }}
              >
                <p
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#57534E',
                    marginBottom: '6px',
                  }}
                >
                  Email
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  style={{
                    fontFamily: FONT,
                    fontSize: '1.1rem',
                    color: '#2E5FA3',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {EMAIL}
                </a>
              </div>
            </FadeInView>

            <FadeInView delay={0.4}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E2D9',
                  borderRadius: '2px',
                  padding: '22px 24px',
                  boxShadow: '0 2px 20px rgba(28,25,23,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <p
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: '#1B2A4A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#C45C1A' }}>⚡</span> Average reply: under 4
                  hours
                </p>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: '1rem',
                    color: '#57534E',
                    lineHeight: 1.7,
                  }}
                >
                  Available Mon–Sat, 9am–9pm GMT+5:30
                </p>
              </div>
            </FadeInView>
          </div>
        </div>
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
    <footer style={{ backgroundColor: '#1B2A4A', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(250,248,244,0.12)',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: '1.15rem',
              color: '#FAF8F4',
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
                  color: 'rgba(250,248,244,0.65)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FAF8F4')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(250,248,244,0.65)')
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
              color: 'rgba(250,248,244,0.5)',
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
            color: 'rgba(250,248,244,0.32)',
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
    <section style={{ backgroundColor: '#1B2A4A', padding: '72px 24px' }}>
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
            fontWeight: 700,
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: '#FAF8F4',
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
            color: 'rgba(250,248,244,0.72)',
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
            color: '#FAF8F4',
            border: '1.5px solid rgba(250,248,244,0.45)',
            borderRadius: '2px',
            padding: '12px 32px',
            textDecoration: 'none',
            marginTop: '8px',
            transition: 'border-color 0.18s, background-color 0.18s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FAF8F4'
            e.currentTarget.style.backgroundColor = 'rgba(250,248,244,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(250,248,244,0.45)'
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartPage() {
  return (
    <div
      style={{
        fontFamily: FONT,
        backgroundColor: '#FAF8F4',
        color: '#1C1917',
        overflowX: 'hidden',
      }}
    >
      <StickyNav />

      <main>
        <Hero />
        <SocialProofBar />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <WhyMeSection />
        <TestimonialsSection />
        <RetainersSection />
        <FAQSection />
        <ContactSection />
      </main>

      <MontnexusBanner />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

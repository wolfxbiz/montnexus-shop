'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'

const FONT = "var(--font-eb-garamond, 'EB Garamond', Georgia, serif)"
const HEADING_FONT = "'The Seasons', Georgia, serif"

const SERVICES = [
  'Website',
  'Web Application',
  'Mobile App (iOS + Android)',
  'Desktop Software',
  'SaaS Platform',
  'Maintenance & Support',
  'Not sure yet',
]

const BUDGETS = [
  'Under $500',
  '$500 – $3,000',
  '$3,000 – $15,000',
  '$15,000+',
  'Not decided yet',
]

interface FormState {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  description: string
}

const EMPTY: FormState = {
  name: '', email: '', phone: '', service: '', budget: '', description: '',
}

// ── Shared input style ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '1rem',
  width: '100%',
  padding: '11px 14px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E2E2',
  borderRadius: '2px',
  color: '#111111',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: '0.7rem',
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color: '#666666',
  marginBottom: '6px',
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: '#111111', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Context ─────────────────────────────────────────────────────────────────

import { createContext, useContext } from 'react'

interface EnquiryContextValue {
  open: () => void
}

const EnquiryContext = createContext<EnquiryContextValue>({ open: () => {} })

export function useEnquiry() {
  return useContext(EnquiryContext)
}

// ── Hook: detect mobile ──────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// ── Provider + Modal ────────────────────────────────────────────────────────

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const isMobile = useIsMobile()

  const open = useCallback(() => { setDone(false); setError(''); setForm(EMPTY); setVisible(true) }, [])
  const close = useCallback(() => setVisible(false), [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#111111')
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#E2E2E2')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again or WhatsApp us directly.')
    } finally {
      setLoading(false)
    }
  }

  // ── Layout values based on viewport ────────────────────────────────────────

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 201,
        width: '100%',
        maxHeight: '92dvh',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 201,
        width: 'min(620px, calc(100vw - 40px))',
        maxHeight: 'calc(100vh - 48px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }

  const mobileAnimation = {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }

  const desktopAnimation = {
    initial: { opacity: 0, y: 28, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.97 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }

  const animation = isMobile ? mobileAnimation : desktopAnimation

  const hPad = isMobile ? '20px' : '32px'
  const vPad = isMobile ? '20px' : '28px'

  return (
    <EnquiryContext.Provider value={{ open }}>
      {children}

      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={close}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                backgroundColor: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Modal / bottom sheet */}
            <motion.div
              key="modal"
              {...animation}
              style={panelStyle}
            >
              {/* Drag handle (mobile only) */}
              {isMobile && (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#DDDDDD' }} />
                </div>
              )}

              {/* Header */}
              <div
                style={{
                  padding: `${isMobile ? '14px' : vPad} ${hPad} ${isMobile ? '14px' : '20px'}`,
                  borderBottom: '1px solid #E2E2E2',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexShrink: 0,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: HEADING_FONT,
                      fontWeight: 400,
                      fontSize: isMobile ? '1.4rem' : '1.75rem',
                      color: '#111111',
                      lineHeight: 1.2,
                      marginBottom: '4px',
                    }}
                  >
                    Tell Us About Your Project
                  </h2>
                  <p style={{ fontFamily: FONT, fontSize: '0.95rem', color: '#666666', lineHeight: 1.6 }}>
                    We&apos;ll get back to you within 4 hours.
                  </p>
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', color: '#666666', flexShrink: 0,
                    marginTop: '2px',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#111111')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  overflowY: 'auto',
                  padding: `${vPad} ${hPad}`,
                  flexGrow: 1,
                  // iOS momentum scrolling
                  WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
                }}
              >
                {done ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '32px 0' }}
                  >
                    <div
                      style={{
                        width: 56, height: 56, borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                      }}
                    >
                      <Check size={24} color="#111111" />
                    </div>
                    <h3
                      style={{
                        fontFamily: HEADING_FONT, fontWeight: 400,
                        fontSize: '1.5rem', color: '#111111', marginBottom: '10px',
                      }}
                    >
                      Enquiry Received
                    </h3>
                    <p style={{ fontFamily: FONT, fontSize: '1.05rem', color: '#666666', lineHeight: 1.8 }}>
                      Thank you. We will review your project and be in touch within 4 hours.
                    </p>
                    <button
                      onClick={close}
                      style={{
                        marginTop: '28px',
                        fontFamily: FONT, fontWeight: 600, fontSize: '1rem',
                        backgroundColor: '#111111', color: '#FFFFFF',
                        border: 'none', borderRadius: '2px',
                        padding: '12px 32px', cursor: 'pointer',
                        width: isMobile ? '100%' : 'auto',
                      }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Name + Email — side by side on desktop, stacked on mobile */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: '14px',
                      }}
                    >
                      <Field label="Full Name" required>
                        <input
                          type="text" required value={form.name} onChange={set('name')}
                          placeholder="Your name" style={inputStyle} onFocus={focus} onBlur={blur}
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="Email" required>
                        <input
                          type="email" required value={form.email} onChange={set('email')}
                          placeholder="your@email.com" style={inputStyle} onFocus={focus} onBlur={blur}
                          autoComplete="email"
                        />
                      </Field>
                    </div>

                    {/* Phone */}
                    <Field label="WhatsApp / Phone">
                      <input
                        type="tel" value={form.phone} onChange={set('phone')}
                        placeholder="+1 234 567 8900" style={inputStyle} onFocus={focus} onBlur={blur}
                        autoComplete="tel"
                      />
                    </Field>

                    {/* Service + Budget — side by side on desktop, stacked on mobile */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: '14px',
                      }}
                    >
                      <Field label="Service">
                        <select value={form.service} onChange={set('service')} style={inputStyle} onFocus={focus} onBlur={blur}>
                          <option value="">Select a service</option>
                          {SERVICES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="Budget">
                        <select value={form.budget} onChange={set('budget')} style={inputStyle} onFocus={focus} onBlur={blur}>
                          <option value="">Select budget</option>
                          {BUDGETS.map(b => <option key={b}>{b}</option>)}
                        </select>
                      </Field>
                    </div>

                    {/* Description */}
                    <Field label="Project Description" required>
                      <textarea
                        required rows={isMobile ? 3 : 4} value={form.description} onChange={set('description')}
                        placeholder="Tell us what you want to build..."
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                        onFocus={focus} onBlur={blur}
                      />
                    </Field>

                    {error && (
                      <p style={{ fontFamily: FONT, fontSize: '0.95rem', color: '#111111' }}>{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        fontFamily: FONT, fontWeight: 600, fontSize: '1.05rem',
                        backgroundColor: loading ? '#333333' : '#111111',
                        color: '#FFFFFF', border: 'none', borderRadius: '2px',
                        padding: '14px 24px', cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.18s', width: '100%',
                        marginTop: '4px',
                      }}
                      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#333333' }}
                      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#111111' }}
                    >
                      {loading ? 'Sending…' : 'Send My Project Details →'}
                    </button>

                    <p style={{ fontFamily: FONT, fontSize: '0.88rem', color: '#666666', textAlign: 'center', paddingBottom: isMobile ? '8px' : '0' }}>
                      Or reach us directly on{' '}
                      <a
                        href="https://wa.me/918137871221"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#111111', textDecoration: 'none' }}
                      >
                        WhatsApp
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </EnquiryContext.Provider>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export function SignInToast() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)

  // Re-check on every page navigation
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem('show_signin_toast')) return

    localStorage.removeItem('show_signin_toast')
    setShow(true)
    setVisible(false)

    // Slide in
    const slideIn = requestAnimationFrame(() => setVisible(true))

    // Slide out after 4s
    const out = setTimeout(() => setVisible(false), 4000)
    const hide = setTimeout(() => setShow(false), 4400)

    return () => {
      cancelAnimationFrame(slideIn)
      clearTimeout(out)
      clearTimeout(hide)
    }
  }, [pathname])

  if (!show) return null

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '14px 24px',
      background: 'var(--color-accent)',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      pointerEvents: 'none',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-bg-base)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-bg-base)',
        letterSpacing: 'var(--tracking-wide)',
      }}>
        {name ? `Welcome back, ${name}` : "You're signed in"}
      </span>
    </div>
  )
}

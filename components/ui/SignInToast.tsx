'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export function SignInToast() {
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('show_signin_toast')) {
      localStorage.removeItem('show_signin_toast')
      setShow(true)
      // Trigger slide-in on next frame
      requestAnimationFrame(() => setVisible(true))
      // Slide out after 4s
      setTimeout(() => {
        setVisible(false)
        setTimeout(() => setShow(false), 400)
      }, 4000)
    }
  }, [user])

  if (!show) return null

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || null

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
      gap: 'var(--space-3)',
      padding: '14px var(--space-6)',
      background: 'var(--color-accent)',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      pointerEvents: 'none',
    }}>
      {/* Checkmark */}
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
        {name ? `Welcome back, ${name}` : 'You\'re signed in'}
      </span>
    </div>
  )
}

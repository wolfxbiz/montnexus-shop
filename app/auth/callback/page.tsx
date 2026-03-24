'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const code = searchParams.get('code')
    const next = searchParams.get('next') || '/'

    async function handleAuth() {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        localStorage.setItem('show_signin_toast', '1')
        router.push(next)
      } else {
        router.push('/auth/login')
      }
    }

    handleAuth()
  }, [router, searchParams])

  return null
}

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '2px solid var(--color-accent)',
        borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto var(--space-4)',
      }} />
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
      }}>
        Signing you in...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-base)',
    }}>
      <Suspense fallback={<LoadingSpinner />}>
        <CallbackHandler />
        <LoadingSpinner />
      </Suspense>
    </main>
  )
}

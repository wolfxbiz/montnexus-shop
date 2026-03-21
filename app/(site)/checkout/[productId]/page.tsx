'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

interface Props {
  params: Promise<{ productId: string }>
}

export default function CheckoutPage({ params }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function startCheckout() {
      try {
        const { productId } = await params
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Checkout failed')
        if (!cancelled && data.url) {
          window.location.href = data.url
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong.')
        }
      }
    }

    startCheckout()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Nav />
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-9) var(--gutter)' }}>
          {error ? (
            <>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginBottom: 'var(--space-6)' }}>
                {error}
              </p>
              <button
                onClick={() => router.back()}
                className="btn btn-secondary"
              >
                Go back
              </button>
            </>
          ) : (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
              Redirecting to checkout…
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

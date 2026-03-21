import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
        404
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 400, color: 'var(--color-text-primary)' }}>
        Page not found
      </h1>
      <Link href="/" className="btn btn-secondary">Go home</Link>
    </main>
  )
}

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer" data-section-theme="purple">
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
        Montnexus
      </span>
      <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
        <Link href="/bundles" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Browse</Link>
        <Link href="/services" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Services</Link>
        <Link href="/showcase" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Showcase</Link>
        <Link href="/articles" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Articles</Link>
        <Link href="/creators" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Creators</Link>
        <Link href="/auth/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Sign in</Link>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
        &copy; 2025 Montnexus
      </p>
    </footer>
  )
}

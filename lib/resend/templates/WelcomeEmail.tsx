import * as React from 'react'

interface WelcomeEmailProps {
  name: string | null
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const greeting = name ? `Hey ${name}` : 'Welcome'

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#14181a', color: '#d4dcd8', padding: '48px 32px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400, color: '#d4dcd8', marginBottom: 8 }}>
        Montnexus
      </h1>
      <p style={{ color: '#6a8078', fontSize: 14, marginBottom: 48 }}>montnexus.shop</p>

      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, marginBottom: 24, lineHeight: 1.4 }}>
        {greeting}, you&apos;re in.
      </h2>

      <p style={{ color: '#9aafa6', lineHeight: 1.8, marginBottom: 24, fontSize: 15 }}>
        Your Montnexus account is live. Here&apos;s what you can do now:
      </p>

      <div style={{ marginBottom: 32 }}>
        <div style={{ padding: '16px 0', borderBottom: '1px solid #1e2628' }}>
          <span style={{ color: '#6a9e78', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>01</span>
          <span style={{ color: '#d4dcd8', marginLeft: 16, fontSize: 15 }}>Browse &amp; download digital products</span>
        </div>
        <div style={{ padding: '16px 0', borderBottom: '1px solid #1e2628' }}>
          <span style={{ color: '#6a9e78', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>02</span>
          <span style={{ color: '#d4dcd8', marginLeft: 16, fontSize: 15 }}>Hire creators for services</span>
        </div>
        <div style={{ padding: '16px 0', borderBottom: '1px solid #1e2628' }}>
          <span style={{ color: '#6a9e78', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>03</span>
          <span style={{ color: '#d4dcd8', marginLeft: 16, fontSize: 15 }}>Share your work in the community showcase</span>
        </div>
        <div style={{ padding: '16px 0' }}>
          <span style={{ color: '#6a9e78', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>04</span>
          <span style={{ color: '#d4dcd8', marginLeft: 16, fontSize: 15 }}>Become a creator and start selling</span>
        </div>
      </div>

      <a
        href="https://montnexus.shop/dashboard"
        style={{
          display: 'inline-block',
          background: '#6a9e78',
          color: '#14181a',
          padding: '14px 32px',
          borderRadius: 4,
          textDecoration: 'none',
          fontFamily: 'monospace',
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          fontWeight: 600,
          marginBottom: 40,
        }}
      >
        Go to Dashboard
      </a>

      <p style={{ color: '#3e5048', fontSize: 13, lineHeight: 1.6 }}>
        If you didn&apos;t create this account, you can safely ignore this email.
      </p>
    </div>
  )
}

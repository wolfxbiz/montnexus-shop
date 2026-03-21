import * as React from 'react'

interface PurchaseEmailProps {
  productTitle: string
  downloadUrl: string
  amountCents: number
}

export function PurchaseEmail({ productTitle, downloadUrl, amountCents }: PurchaseEmailProps) {
  const price = amountCents === 0 ? 'Free' : `$${(amountCents / 100).toFixed(2)}`
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#14181a', color: '#d4dcd8', padding: '48px 32px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400, color: '#d4dcd8', marginBottom: 8 }}>
        Montnexus
      </h1>
      <p style={{ color: '#6a8078', fontSize: 14, marginBottom: 48 }}>montnexus.shop</p>

      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, marginBottom: 16 }}>
        Your download is ready
      </h2>
      <p style={{ color: '#6a8078', lineHeight: 1.6, marginBottom: 32 }}>
        Thank you for your purchase. <strong style={{ color: '#d4dcd8' }}>{productTitle}</strong> ({price}) is ready to download.
      </p>

      <a
        href={downloadUrl}
        style={{
          display: 'inline-block',
          background: '#6a9e78',
          color: '#14181a',
          padding: '12px 28px',
          borderRadius: 4,
          textDecoration: 'none',
          fontFamily: 'monospace',
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 32,
        }}
      >
        Download Now
      </a>

      <p style={{ color: '#3e5048', fontSize: 13 }}>
        This link expires 15 minutes after first use. You can regenerate a new link from your dashboard at any time.
      </p>
    </div>
  )
}

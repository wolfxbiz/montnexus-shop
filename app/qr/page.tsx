'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'

const DEFAULT_URL = 'https://montnexus.com/work-with-us'

const SIZES = [
  { label: 'Medium', value: 400, download: 400 },
  { label: 'Large', value: 600, download: 600 },
  { label: 'Print', value: 800, download: 1200 },
] as const

type SizeOption = (typeof SIZES)[number]

export default function QRPage() {
  const [url, setUrl] = useState(DEFAULT_URL)
  const [activeSize, setActiveSize] = useState<SizeOption>(SIZES[0])
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Download the canvas as a high-res PNG ──────────────────────────────────
  const download = () => {
    const src = containerRef.current?.querySelector('canvas')
    if (!src) return

    const out = document.createElement('canvas')
    out.width = activeSize.download
    out.height = activeSize.download
    const ctx = out.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(src, 0, 0, activeSize.download, activeSize.download)

    const link = document.createElement('a')
    link.download = `montnexus-work-with-us-qr-${activeSize.download}px.png`
    link.href = out.toDataURL('image/png')
    link.click()
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-5)',
        gap: 'var(--space-6)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <Image
          src="/mnx-logo.png"
          alt="Montnexus"
          width={140}
          height={36}
          style={{ filter: 'brightness(0) invert(0.85)', objectFit: 'contain', margin: '0 auto var(--space-5)' }}
          priority
        />
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            lineHeight: 'var(--leading-tight)',
            marginBottom: 'var(--space-2)',
          }}
        >
          QR Code
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
          }}
        >
          /work-with-us
        </p>
      </div>

      {/* QR card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          display: 'inline-block',
        }}
      >
        <div ref={containerRef}>
          <QRCodeCanvas
            value={url}
            size={activeSize.value}
            bgColor="#ffffff"
            fgColor="#1a2022"
            level="H"
            marginSize={1}
            imageSettings={{
              src: '/mnx-icon-black.png',
              // Native size: 184×86px → ratio 2.14:1
              // Width drives the size; height is derived to preserve ratio exactly
              width: Math.round(activeSize.value * 0.22),
              height: Math.round(activeSize.value * 0.22 / 2.14),
              excavate: true,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {/* URL input */}
        <div>
          <label
            htmlFor="qr-url"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-2)',
            }}
          >
            Destination URL
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              id="qr-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
              style={{ flexGrow: 1, fontSize: 'var(--text-sm)' }}
            />
            <button
              onClick={copyUrl}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                padding: '0 var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-strong)',
                background: copied ? 'var(--color-accent-soft)' : 'var(--color-bg-overlay)',
                color: copied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-base)',
                flexShrink: 0,
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Size picker */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-2)',
            }}
          >
            Export resolution
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {SIZES.map((s) => (
              <button
                key={s.label}
                onClick={() => setActiveSize(s)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-wider)',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: activeSize.label === s.label
                    ? 'var(--color-accent)'
                    : 'var(--color-border-strong)',
                  background: activeSize.label === s.label
                    ? 'var(--color-accent-soft)'
                    : 'var(--color-bg-overlay)',
                  color: activeSize.label === s.label
                    ? 'var(--color-accent)'
                    : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  flexGrow: 1,
                }}
              >
                {s.label}
                <span
                  style={{
                    display: 'block',
                    fontSize: '9px',
                    opacity: 0.6,
                    marginTop: '2px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.download}px
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Download */}
        <button
          onClick={download}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 400,
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            padding: '0.85rem var(--space-5)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-accent)',
            background: 'var(--color-accent)',
            color: '#14181a',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-accent-muted)'
            e.currentTarget.style.borderColor = 'var(--color-accent-muted)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-accent)'
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Download PNG — {activeSize.download}×{activeSize.download}px
        </button>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: 'var(--tracking-wide)',
            textAlign: 'center',
          }}
        >
          Print uses 1200px · suitable for A4, flyers, business cards
        </p>
      </div>
    </div>
  )
}

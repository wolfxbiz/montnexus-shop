import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'free' | 'blue'
type Size = 'sm' | 'md'

interface ButtonProps {
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled,
  type = 'button',
  children,
  className = '',
  style,
}: ButtonProps) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'text-xs py-2 px-4' : ''} ${className}`
  if (href) return <Link href={href} className={cls} style={style}>{children}</Link>
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>
      {children}
    </button>
  )
}

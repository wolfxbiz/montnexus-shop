'use client'
import { useState } from 'react'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (loading) return
    // Optimistic update
    setLiked(l => !l)
    setCount(c => liked ? c - 1 : c + 1)
    setLoading(true)
    try {
      const res = await fetch(`/api/showcase/${postId}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        setCount(data.like_count)
      } else {
        // Revert on error
        setLiked(l => !l)
        setCount(c => liked ? c + 1 : c - 1)
      }
    } catch {
      setLiked(l => !l)
      setCount(c => liked ? c + 1 : c - 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={liked ? 'Unlike' : 'Like'}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'none',
        border: 'none',
        cursor: loading ? 'default' : 'pointer',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-full)',
        transition: 'all var(--transition-fast)',
        color: liked ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        minHeight: 44,
        opacity: loading ? 0.7 : 1,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)' }}>
        {count}
      </span>
    </button>
  )
}

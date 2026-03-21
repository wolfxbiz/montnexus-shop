'use client'
import { useEffect } from 'react'

export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const observe = () => {
      document.querySelectorAll('.reveal, .reveal-group').forEach((el) => {
        observer.observe(el)
      })
    }

    observe()

    // Re-observe on route changes
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}

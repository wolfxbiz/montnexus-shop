'use client'
import { useEffect, useRef } from 'react'

type Theme = 'moss' | 'sage' | 'blue' | 'amber' | 'purple'
type RGB = [number, number, number]

// Palettes with DRAMATIC background tint differences (8–15 unit swings)
const PALETTES: Record<Theme, {
  accent: RGB; muted: RGB
  bgBase: RGB; bgRaised: RGB; bgOverlay: RGB
  borderMain: RGB; borderStrong: RGB
}> = {
  moss: {
    accent:      [106, 168, 120],
    muted:       [76,  128, 90],
    bgBase:      [14,  22,  18],
    bgRaised:    [20,  30,  24],
    bgOverlay:   [26,  38,  32],
    borderMain:  [30,  46,  36],
    borderStrong:[48,  68,  54],
  },
  blue: {
    accent:      [90,  155, 185],
    muted:       [65,  120, 155],
    bgBase:      [12,  18,  28],
    bgRaised:    [18,  26,  40],
    bgOverlay:   [22,  34,  52],
    borderMain:  [28,  40,  58],
    borderStrong:[40,  56,  80],
  },
  amber: {
    accent:      [195, 160, 90],
    muted:       [158, 125, 65],
    bgBase:      [24,  20,  12],
    bgRaised:    [34,  28,  18],
    bgOverlay:   [44,  36,  22],
    borderMain:  [52,  44,  28],
    borderStrong:[72,  60,  38],
  },
  sage: {
    accent:      [138, 178, 150],
    muted:       [100, 140, 115],
    bgBase:      [16,  22,  18],
    bgRaised:    [24,  32,  26],
    bgOverlay:   [32,  42,  34],
    borderMain:  [38,  50,  42],
    borderStrong:[54,  72,  58],
  },
  purple: {
    accent:      [158, 115, 195],
    muted:       [125, 85,  165],
    bgBase:      [18,  12,  28],
    bgRaised:    [26,  18,  40],
    bgOverlay:   [34,  24,  52],
    borderMain:  [42,  30,  58],
    borderStrong:[60,  44,  82],
  },
}

const DURATION = 1200

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}
function rgb(c: RGB) { const [r, g, b] = c.map(Math.round); return `rgb(${r},${g},${b})` }
function rgba(c: RGB, a: number) { const [r, g, b] = c.map(Math.round); return `rgba(${r},${g},${b},${a})` }

interface ColorState {
  accent: RGB; muted: RGB
  bgBase: RGB; bgRaised: RGB; bgOverlay: RGB
  borderMain: RGB; borderStrong: RGB
}

function applyColors(s: ColorState) {
  const root = document.documentElement
  root.style.setProperty('--color-accent',        rgb(s.accent))
  root.style.setProperty('--color-accent-muted',   rgb(s.muted))
  root.style.setProperty('--color-accent-soft',    rgba(s.accent, 0.14))
  root.style.setProperty('--color-accent-glow',    rgba(s.accent, 0.07))
  root.style.setProperty('--color-bg-base',        rgb(s.bgBase))
  root.style.setProperty('--color-bg-raised',      rgb(s.bgRaised))
  root.style.setProperty('--color-bg-overlay',     rgb(s.bgOverlay))
  root.style.setProperty('--color-border',         rgb(s.borderMain))
  root.style.setProperty('--color-border-strong',  rgb(s.borderStrong))
}

function lerpState(from: ColorState, to: ColorState, t: number): ColorState {
  return {
    accent:      lerpRGB(from.accent,      to.accent,      t),
    muted:       lerpRGB(from.muted,       to.muted,       t),
    bgBase:      lerpRGB(from.bgBase,      to.bgBase,      t),
    bgRaised:    lerpRGB(from.bgRaised,    to.bgRaised,    t),
    bgOverlay:   lerpRGB(from.bgOverlay,   to.bgOverlay,   t),
    borderMain:  lerpRGB(from.borderMain,  to.borderMain,  t),
    borderStrong:lerpRGB(from.borderStrong,to.borderStrong, t),
  }
}

function paletteToState(p: typeof PALETTES[Theme]): ColorState {
  return {
    accent: p.accent, muted: p.muted,
    bgBase: p.bgBase, bgRaised: p.bgRaised, bgOverlay: p.bgOverlay,
    borderMain: p.borderMain, borderStrong: p.borderStrong,
  }
}

export function ScrollThemeProvider() {
  const raf         = useRef(0)
  const current     = useRef<ColorState>(paletteToState(PALETTES.moss))
  const activeTheme = useRef<Theme>('moss')

  useEffect(() => {
    let attempts = 0

    function tryInit() {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-section-theme]')
      )
      if (sections.length === 0 && attempts < 20) {
        attempts++
        setTimeout(tryInit, 150)
        return
      }
      if (!sections.length) return

      function getActiveTheme(): Theme {
        const probe = window.scrollY + window.innerHeight * 0.4
        let best: Theme = 'moss'
        for (const el of sections) {
          const rect = el.getBoundingClientRect()
          const top = rect.top + window.scrollY
          const bottom = top + rect.height
          if (probe >= top && probe < bottom) {
            best = (el.dataset.sectionTheme as Theme) || best
            break
          }
          if (probe >= top) {
            best = (el.dataset.sectionTheme as Theme) || best
          }
        }
        return best
      }

      function transitionTo(theme: Theme) {
        if (theme === activeTheme.current) return
        activeTheme.current = theme
        cancelAnimationFrame(raf.current)

        const from: ColorState = { ...current.current }
        const to = paletteToState(PALETTES[theme])
        const t0 = performance.now()

        function tick(now: number) {
          const progress = Math.min((now - t0) / DURATION, 1)
          const e = easeInOut(progress)
          const state = lerpState(from, to, e)
          current.current = state
          applyColors(state)
          if (progress < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
      }

      let ticking = false
      function onScroll() {
        if (ticking) return
        ticking = true
        requestAnimationFrame(() => {
          transitionTo(getActiveTheme())
          ticking = false
        })
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()

      cleanupRef.current = () => {
        window.removeEventListener('scroll', onScroll)
        cancelAnimationFrame(raf.current)
      }
    }

    const cleanupRef = { current: () => {} }
    tryInit()
    return () => cleanupRef.current()
  }, [])

  return null
}

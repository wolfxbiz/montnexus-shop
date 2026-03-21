---
name: montnexus-design-system
description: Build frontend UI for montnexus.shop using The Seasons font and the Slate & Moss design system. Use this skill whenever building any page, component, section, card, button, form, or layout for the montnexus project. Triggers on any request to build, design, style, or create UI for montnexus — including landing pages, product cards, checkout flows, dashboards, navigation, and hero sections. Always use this skill before writing any montnexus frontend code, even for small components.
---

# Montnexus Design System

A minimal, editorial design system for **montnexus.shop** — a digital product marketplace. The aesthetic is **Slate & Moss**: cool dark slate backgrounds, moss green as the primary accent, slate-blue as a secondary, and cool off-white text. Calm, contemporary, and quietly premium. Think deep forest at dusk — not warm, not cold, just still.

> **Active theme: Slate & Moss**
> All color tokens below reflect this theme. No italics on The Seasons typeface — upright only.

---

## Typography

### Fonts

**Display / Headings**: [The Seasons](https://fonts.cdnfonts.com/css/the-seasons) — a high-contrast serif with editorial weight. Use for all headings, hero text, and product names.

**Body / UI**: `'Cormorant Garamond'` from Google Fonts — refined, elegant, pairs naturally with The Seasons.

**Mono / Labels**: `'DM Mono'` from Google Fonts — for prices, tags, badges, and small UI labels.

### Loading fonts in HTML

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/the-seasons" rel="stylesheet">
```

### Type scale

```css
--font-display: 'The Seasons', Georgia, serif;
--font-body:    'Cormorant Garamond', Georgia, serif;
--font-mono:    'DM Mono', monospace;

--text-xs:   0.75rem;   /* 12px — mono labels, tags */
--text-sm:   0.875rem;  /* 14px — captions, metadata */
--text-base: 1.0625rem; /* 17px — body copy */
--text-lg:   1.25rem;   /* 20px — lead text, card titles */
--text-xl:   1.625rem;  /* 26px — section headings */
--text-2xl:  2.25rem;   /* 36px — page headings */
--text-3xl:  3.25rem;   /* 52px — hero titles */
--text-4xl:  4.5rem;    /* 72px — full-bleed display */

--leading-tight:  1.1;
--leading-normal: 1.55;
--leading-loose:  1.85;
--tracking-tight: -0.02em;
--tracking-wide:  0.08em;
--tracking-wider: 0.18em;  /* mono labels, uppercase tags */
```

### Usage rules

- All headings (`h1`–`h4`): `font-family: var(--font-display)`, `font-weight: 400` (The Seasons looks best at regular weight)
- Body text: `font-family: var(--font-body)`, `font-weight: 300`–`400`
- Prices, counts, file sizes, labels: `font-family: var(--font-mono)`, `font-weight: 300`
- Uppercase text: ALWAYS add `letter-spacing: var(--tracking-wider)`, never uppercase without it
- **No italics** — The Seasons is used upright only. Never set `font-style: italic` on display or heading text.

---

## Color Palette — Slate & Moss

The palette references a deep forest at dusk — cool, calm, and still. Dark slate backgrounds, moss green as the primary action color, muted slate-blue as a secondary, and cool off-white for text. Not warm, not cold. Just composed.

```css
:root {
  /* --- Backgrounds --- */
  --color-bg-base:    #14181a;   /* deep cool slate — page background */
  --color-bg-raised:  #1a2022;   /* slightly lighter — cards, panels */
  --color-bg-overlay: #202830;   /* hover states, input fills */
  --color-bg-subtle:  #1e2628;   /* subtle section fills */

  /* --- Surface (light variant, for inverted sections) --- */
  --color-surface-light: #e8eeed;  /* cool off-white */
  --color-surface-mid:   #d0d8d4;  /* muted cool grey-green */
  --color-surface-dim:   #b4c0bc;  /* cool mid-tone */

  /* --- Primary accent — Moss Green --- */
  --color-accent:        #6a9e78;  /* moss green — CTAs, links, highlights */
  --color-accent-muted:  #527a5e;  /* deeper moss — hover */
  --color-accent-soft:   rgba(106,158,120,0.14); /* tints, focus rings */
  --color-accent-glow:   rgba(106,158,120,0.07); /* subtle backgrounds */

  /* --- Secondary accent — Slate Blue --- */
  --color-blue:          #6494a8;  /* muted slate-blue */
  --color-blue-muted:    #4e7890;
  --color-blue-soft:     rgba(100,148,168,0.14);

  /* --- Tertiary — Pale Sage --- */
  --color-sage:          #8aab96;  /* lighter sage — secondary tags */
  --color-sage-muted:    #6a8878;
  --color-sage-soft:     rgba(138,171,150,0.12);

  /* --- Text --- */
  --color-text-primary:   #d4dcd8;  /* cool off-white */
  --color-text-secondary: #6a8078;  /* muted teal-grey */
  --color-text-tertiary:  #3e5048;  /* dark muted — placeholders, metadata */
  --color-text-inverted:  #14181a;  /* text on light surfaces */

  /* --- Borders --- */
  --color-border:         #242c2e;  /* subtle cool border */
  --color-border-muted:   #1c2426;  /* barely-there dividers */
  --color-border-strong:  #344038;  /* visible borders, outlines */

  /* --- Semantic --- */
  --color-success: #6a9e78;  /* same as accent/moss */
  --color-warning: #a89060;  /* muted amber */
  --color-error:   #9e6060;  /* muted red-slate */
}
```

### Light mode variant (for inverted sections)

```css
.surface-light {
  --color-bg-base:        #e8eeed;
  --color-bg-raised:      #dde6e2;
  --color-bg-overlay:     #d0d8d4;
  --color-text-primary:   #14181a;
  --color-text-secondary: #3a5048;
  --color-text-tertiary:  #6a8078;
  --color-border:         #b4c0bc;
  --color-border-muted:   #c8d4d0;
}
```

---

## Spacing & Layout

```css
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.5rem;    /* 24px */
--space-6:  2rem;      /* 32px */
--space-7:  3rem;      /* 48px */
--space-8:  4rem;      /* 64px */
--space-9:  6rem;      /* 96px */
--space-10: 8rem;      /* 128px */

--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   14px;
--radius-xl:   22px;
--radius-full: 9999px;

--max-width:      1180px;
--content-width:  720px;  /* for reading-width sections */
--gutter:         clamp(1.5rem, 5vw, 3rem);

--transition-fast:   150ms ease;
--transition-base:   250ms ease;
--transition-slow:   450ms cubic-bezier(0.16, 1, 0.3, 1);
```

---

## Base CSS Reset & Root Styles

Always include this block at the top of every page/component:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-base);  /* #14181a */
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}
a:hover { color: var(--color-accent-muted); }

img, video { max-width: 100%; display: block; }

::selection {
  background: var(--color-accent-soft);
  color: var(--color-text-primary);
}
```

---

## Components

### Buttons

```css
/* Base button */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  padding: 0.7rem 1.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

/* Primary — terracotta */
.btn-primary {
  background: var(--color-accent);
  color: #1c1916;
  border-color: var(--color-accent);
}
.btn-primary:hover {
  background: var(--color-accent-muted);
  border-color: var(--color-accent-muted);
  transform: translateY(-1px);
}

/* Secondary — outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-border-strong);
}
.btn-secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Ghost — text only */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
  padding-left: 0; padding-right: 0;
}
.btn-ghost:hover { color: var(--color-text-primary); }

/* Free badge button */
.btn-free {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  border-color: var(--color-accent-muted);
}

/* Secondary info button — slate blue */
.btn-blue {
  background: var(--color-blue-soft);
  color: var(--color-blue);
  border-color: var(--color-blue-muted);
}
```

### Cards — Product Bundle Card

```css
.card {
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-base), transform var(--transition-slow);
}
.card:hover {
  border-color: var(--color-border);
  transform: translateY(-3px);
}

.card-cover {
  aspect-ratio: 4 / 3;
  background: var(--color-bg-overlay);
  overflow: hidden;
  position: relative;
}
.card-cover img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.card:hover .card-cover img { transform: scale(1.04); }

.card-body {
  padding: var(--space-5) var(--space-5) var(--space-6);
}

.card-category {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-loose);
  margin-bottom: var(--space-5);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-price {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  color: var(--color-text-primary);
}
.card-price.is-free {
  color: var(--color-sage);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}
```

### Navigation

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--gutter);
  background: var(--color-bg-base);
  border-bottom: 1px solid var(--color-border-muted);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-logo {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-tight);
  font-style: italic;
}

.nav-links {
  display: flex;
  gap: var(--space-7);
  list-style: none;
}

.nav-links a {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  transition: color var(--transition-fast);
}
.nav-links a:hover { color: var(--color-text-primary); }
```

### Hero Section

```css
.hero {
  padding: var(--space-10) var(--gutter);
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-9);
  align-items: center;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-accent);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.hero-eyebrow::before {
  content: '';
  display: block;
  width: 24px;
  height: 1px;
  background: var(--color-accent);
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}
.hero-title em {
  font-style: italic;
  color: var(--color-accent);
}

.hero-lead {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-loose);
  margin-bottom: var(--space-7);
  max-width: 44ch;
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  flex-wrap: wrap;
}
```

### Tags / Badges

```css
.tag {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
}
.tag-default  { background: var(--color-bg-overlay);    color: var(--color-text-secondary); }
.tag-accent   { background: var(--color-accent-soft);   color: var(--color-accent); }
.tag-blue     { background: var(--color-blue-soft);     color: var(--color-blue); }
.tag-sage     { background: var(--color-sage-soft);     color: var(--color-sage); }
.tag-free     { background: var(--color-accent-soft);   color: var(--color-accent); }
.tag-paid     { background: var(--color-blue-soft);     color: var(--color-blue); }
```

### Inputs / Forms

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.input {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  transition: border-color var(--transition-fast);
  outline: none;
  width: 100%;
}
.input::placeholder { color: var(--color-text-tertiary); }
.input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}
```

### Dividers & Decorative Elements

```css
/* Thin horizontal rule */
.divider {
  border: none;
  border-top: 1px solid var(--color-border-muted);
  margin: var(--space-8) 0;
}

/* Section label with lines on both sides */
.section-label {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  margin-bottom: var(--space-7);
}
.section-label::before,
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border-muted);
}
```

---

## Layout Patterns

### Page wrapper

```html
<div class="page">
  <nav class="nav">...</nav>
  <main>...</main>
  <footer>...</footer>
</div>
```

```css
.page { min-height: 100vh; display: flex; flex-direction: column; }
main  { flex: 1; }

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.section { padding: var(--space-9) 0; }
.section-sm { padding: var(--space-7) 0; }
```

### Product grid

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}
```

### 2-column feature layout

```css
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-9);
  align-items: center;
}
@media (max-width: 768px) {
  .two-col { grid-template-columns: 1fr; }
}
```

---

## Texture & Atmosphere

Slate & Moss is composed and still. Use these sparingly — atmosphere should whisper, not shout.

```css
/* Slate & Moss hero gradient */
.hero-bg-slate {
  background:
    radial-gradient(ellipse 70% 60% at 60% 40%, rgba(106,158,120,0.07) 0%, transparent 65%),
    radial-gradient(ellipse 50% 50% at 15% 75%, rgba(100,148,168,0.06) 0%, transparent 60%),
    var(--color-bg-base);
}

/* Grain overlay — subtle texture on hero backgrounds */
.grain-overlay { position: relative; }
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
}

/* Warm bottom fade on sections */
.fade-bottom {
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}
```

---

## Animation Guidelines

Keep motion restrained — dusk is still, not frenetic.

```css
/* Fade up on load — use with JS to add .visible class */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Stagger children */
.reveal-group > * { opacity: 0; transform: translateY(12px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-group.visible > *:nth-child(1) { transition-delay: 0ms; opacity: 1; transform: none; }
.reveal-group.visible > *:nth-child(2) { transition-delay: 80ms; opacity: 1; transform: none; }
.reveal-group.visible > *:nth-child(3) { transition-delay: 160ms; opacity: 1; transform: none; }
.reveal-group.visible > *:nth-child(4) { transition-delay: 240ms; opacity: 1; transform: none; }
```

---

## Do / Don't

| Do | Don't |
|---|---|
| Use The Seasons upright for all headings | Use italics on The Seasons — ever |
| Use Cormorant Garamond for body copy | Use Inter, Roboto, or system-ui |
| Stick to the Slate & Moss palette | Mix in warm tones (terracotta, amber) |
| Mono font for prices, tags, labels | Serif or display font for UI labels |
| Generous whitespace, quiet layouts | Cluttered, dense sections |
| Subtle grain + cool radial gradients | Heavy drop shadows or glows |
| Moss green `#6a9e78` as the primary accent | Pure green or bright lime |
| Slate blue `#6494a8` as the secondary accent | Vivid blue or neon tones |
| `letter-spacing` on all mono uppercase | Uppercase without tracking |
| Dark `#14181a` as page background | White or light backgrounds as default |

---

## Quick Reference — Color Intent

| Variable | Hex | Use for |
|---|---|---|
| `--color-bg-base` | `#14181a` | Page background |
| `--color-bg-raised` | `#1a2022` | Cards, panels |
| `--color-bg-overlay` | `#202830` | Hover states, input fills |
| `--color-accent` | `#6a9e78` | CTAs, links, free tags, primary actions |
| `--color-accent-muted` | `#527a5e` | Accent hover state |
| `--color-blue` | `#6494a8` | Secondary actions, paid tags, info |
| `--color-blue-muted` | `#4e7890` | Blue hover state |
| `--color-sage` | `#8aab96` | Tertiary tags, soft highlights |
| `--color-text-primary` | `#d4dcd8` | Headings, important text |
| `--color-text-secondary` | `#6a8078` | Body copy, descriptions |
| `--color-text-tertiary` | `#3e5048` | Placeholders, metadata, captions |
| `--color-border-muted` | `#1c2426` | Subtle dividers |
| `--color-border` | `#242c2e` | Standard card borders |
| `--color-border-strong` | `#344038` | Visible outlines, input borders |

# Montnexus — Site Architecture

**montnexus.shop** · Digital Product Marketplace · Theme: Slate & Moss · v1.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Pages & Routes](#3-pages--routes)
4. [API Endpoints](#4-api-endpoints)
5. [Database Schema](#5-database-schema)
6. [Purchase & Download Flow](#6-purchase--download-flow)
7. [Folder Structure](#7-folder-structure)
8. [Environment Variables](#8-environment-variables)
9. [Design System — Slate & Moss](#9-design-system--slate--moss)

---

## 1. Project Overview

Montnexus is a minimal, editorial digital product marketplace. It sells curated bundles of digital assets — UI kits, code templates, eBooks, icon sets, and productivity templates — for both free and paid download.

| Property | Value |
|---|---|
| Domain | `montnexus.shop` |
| Product type | Digital bundles — free and paid download |
| Categories | UI kits, dev templates, icon packs, eBooks, Notion/Figma templates |
| Primary CTA | Browse bundles → product grid |
| Secondary CTA | Free downloads → filtered $0 products |
| Target user | Designers, frontend developers, indie creators |

---

## 2. Tech Stack

| Technology | Role |
|---|---|
| **Next.js 14** (App Router) | Frontend framework — SSR, SEO, API routes, file-based routing |
| **TypeScript** | Type safety across frontend and API layer |
| **Tailwind CSS + CSS vars** | Utility classes + Slate & Moss design tokens via CSS custom properties |
| **Supabase** | PostgreSQL database + Auth (email & Google OAuth) + file storage |
| **Stripe** | Checkout sessions for paid products |
| **Resend** | Transactional email — receipts and download links |
| **Vercel** | Hosting + CDN edge deployment, zero-config CI/CD from GitHub |
| **GitHub** | Source control — `main` branch auto-deploys to Vercel production |

### Build Order

Follow this sequence to avoid blockers:

```
1.  Scaffold Next.js 14 project with TypeScript and Tailwind
2.  Set up Supabase project — run schema migrations (see Section 5)
3.  Wire Supabase Auth — email sign-up + Google OAuth
4.  Build product listing and detail pages with static mock data
5.  Upload test bundle to Supabase Storage, confirm signed URL flow
6.  Integrate Stripe Checkout for a paid product
7.  Implement /api/webhook — mark order paid, unlock download
8.  Implement /api/download — generate 15-min signed URL
9.  Wire Resend — send receipt + download link on successful payment
10. Polish: user dashboard, free download flow, newsletter form
```

---

## 3. Pages & Routes

### Public Pages

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, featured bundles, how-it-works, CTA, newsletter |
| `/bundles` | Browse all products — filterable grid (category, price: free/paid) |
| `/bundles/[slug]` | Product detail — cover, description, file list, price, CTA |
| `/checkout/[productId]` | Stripe Checkout redirect — creates session and forwards |
| `/checkout/success` | Post-payment confirmation — order summary, download link |

### Auth Pages

| Route | Purpose |
|---|---|
| `/auth/login` | Sign in — email + Google OAuth |
| `/auth/signup` | Sign up — email registration |
| `/auth/callback` | Supabase OAuth callback handler |

### Protected Pages

| Route | Purpose |
|---|---|
| `/dashboard` | User dashboard — purchase history, active download links |

---

## 4. API Endpoints

All routes live under `/app/api/`.

| Method | Endpoint | Behaviour |
|---|---|---|
| `GET` | `/api/products` | List products — supports `?category=` and `?free=true` query params |
| `GET` | `/api/products/[slug]` | Single product detail by slug |
| `POST` | `/api/checkout` | Create Stripe Checkout session for paid product |
| `POST` | `/api/checkout/free` | Claim free product — writes order row, returns download token |
| `POST` | `/api/webhook` | Stripe webhook — on `checkout.session.completed`, marks order paid and creates download token |
| `GET` | `/api/download/[token]` | Validate token → return 15-min signed Supabase Storage URL |

> **Security:** The `/api/webhook` route must verify the `stripe-signature` header on every request. The `/api/download/[token]` route must confirm the token belongs to the authenticated user before generating a signed URL.

---

## 5. Database Schema

PostgreSQL via Supabase. All tables use UUID primary keys and `timestamptz` for timestamps. Row Level Security (RLS) is enabled — users can only read their own orders and downloads.

### `products`

Stores every bundle listed on the site.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY, `default gen_random_uuid()` |
| `title` | `text` | NOT NULL — display name |
| `slug` | `text` | UNIQUE NOT NULL — URL identifier |
| `description` | `text` | Long-form marketing copy |
| `short_desc` | `text` | One-line card description (max 120 chars) |
| `category` | `text` | `design` \| `dev` \| `ebook` \| `template` \| `icon` |
| `price_cents` | `integer` | Price in cents. `0` = free product |
| `is_free` | `boolean` | Derived from `price_cents = 0`, indexed |
| `file_path` | `text` | Supabase Storage path — **never exposed to client** |
| `cover_url` | `text` | Public cover image URL |
| `file_count` | `integer` | Number of files in bundle |
| `published` | `boolean` | `default false` — draft/publish control |
| `created_at` | `timestamptz` | `default now()` |

### `orders`

One row per purchase or free claim.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `product_id` | `uuid` | FK → `products.id` |
| `stripe_session_id` | `text` | Nullable — null for free orders |
| `stripe_payment_intent` | `text` | Nullable |
| `amount_cents` | `integer` | `0` for free; mirrors price at time of purchase |
| `status` | `text` | `pending` \| `paid` \| `free` \| `refunded` |
| `created_at` | `timestamptz` | `default now()` |

### `downloads`

Secure download tokens — one per order.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `order_id` | `uuid` | FK → `orders.id` UNIQUE |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `product_id` | `uuid` | FK → `products.id` |
| `token` | `text` | UNIQUE — random 64-char hex, used in download URL |
| `expires_at` | `timestamptz` | Reset to `now() + 15 min` on each use |
| `download_count` | `integer` | `default 0` |
| `created_at` | `timestamptz` | `default now()` |

### `profiles`

Public user profile, extends `auth.users`.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY — matches `auth.users.id` |
| `display_name` | `text` | Optional |
| `avatar_url` | `text` | Optional |
| `stripe_customer_id` | `text` | Linked on first Stripe purchase |
| `newsletter` | `boolean` | `default false` — newsletter opt-in |
| `updated_at` | `timestamptz` | `default now()` |

---

## 6. Purchase & Download Flow

### Paid Product

```
User clicks "Buy"
  → POST /api/checkout
  → Stripe Checkout session created
  → User completes payment on Stripe-hosted page
  → Stripe fires checkout.session.completed webhook
  → POST /api/webhook verifies stripe-signature
  → Order row created (status: paid)
  → Downloads row created with secure token
  → Resend sends receipt email with /api/download/{token} link
  → User lands on /checkout/success
  → User clicks download → GET /api/download/{token}
  → Token validated, expires_at refreshed
  → 15-min signed Supabase Storage URL returned
  → Browser downloads file directly from storage
```

### Free Product

```
User clicks "Download free"
  → POST /api/checkout/free
  → Auth check
  → Order row created (status: free)
  → Downloads row created with secure token
  → Token returned in response (no email needed)
  → Frontend calls GET /api/download/{token}
  → Signed URL returned immediately
  → Browser downloads file
```

> **Security:** All product files must be in a **private** Supabase Storage bucket. The `file_path` column is never exposed to the client. Only `/api/download` can generate signed URLs, and only after validating the token matches a paid or free order belonging to the requesting user.

---

## 7. Folder Structure

```
montnexus/
├── app/
│   ├── (site)/                       # Public-facing pages
│   │   ├── page.tsx                  # / — Landing page
│   │   ├── bundles/
│   │   │   ├── page.tsx              # /bundles — Browse grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # /bundles/[slug] — Detail
│   │   └── checkout/
│   │       ├── [productId]/
│   │       │   └── page.tsx
│   │       └── success/
│   │           └── page.tsx
│   ├── (auth)/                       # Auth pages
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/page.tsx
│   ├── dashboard/
│   │   └── page.tsx                  # /dashboard — User downloads
│   └── api/
│       ├── products/
│       │   ├── route.ts              # GET /api/products
│       │   └── [slug]/route.ts       # GET /api/products/[slug]
│       ├── checkout/
│       │   ├── route.ts              # POST /api/checkout
│       │   └── free/route.ts         # POST /api/checkout/free
│       ├── webhook/
│       │   └── route.ts              # POST /api/webhook (Stripe)
│       └── download/
│           └── [token]/route.ts      # GET /api/download/[token]
│
├── components/
│   ├── ui/                           # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Tag.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   └── sections/                     # Page-level section components
│       ├── Hero.tsx
│       ├── ProductGrid.tsx
│       ├── HowItWorks.tsx
│       ├── CtaBanner.tsx
│       └── Newsletter.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client (service role)
│   ├── stripe/
│   │   └── index.ts                  # Stripe client + helpers
│   └── resend/
│       ├── index.ts                  # Resend client
│       └── templates/
│           └── PurchaseEmail.tsx     # Receipt email template
│
├── styles/
│   ├── globals.css                   # CSS reset + all Slate & Moss tokens
│   └── tokens.css                    # Design token definitions only
│
├── public/
│   └── fonts/                        # The Seasons font files (self-hosted fallback)
│
├── supabase/
│   └── migrations/                   # SQL migration files — run in order
│       ├── 001_products.sql
│       ├── 002_orders.sql
│       ├── 003_downloads.sql
│       ├── 004_profiles.sql
│       └── 005_rls_policies.sql
│
├── types/
│   └── index.ts                      # Shared TypeScript types
│
├── .env.local                        # Local env vars (see Section 8)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 8. Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key        # safe for client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key    # server only — never expose

# Stripe
STRIPE_SECRET_KEY=sk_live_...                      # server only
STRIPE_WEBHOOK_SECRET=whsec_...                    # server only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...     # safe for client

# Email
RESEND_API_KEY=re_...                              # server only

# App
NEXT_PUBLIC_SITE_URL=https://montnexus.shop        # used in Stripe success_url
```

> **Rule:** Any variable without the `NEXT_PUBLIC_` prefix is server-only. Never reference it in a client component or include it in an API response payload.

---

## 9. Design System — Slate & Moss

> **Active theme: Slate & Moss.** All tokens below are final. No warm tones. No italics on The Seasons typeface — upright only at all times.

---

### 9.1 Typography

| Role | Font | Source |
|---|---|---|
| Display / Headings | The Seasons | `fonts.cdnfonts.com/css/the-seasons` |
| Body / UI | Cormorant Garamond (300, 400, 500) | Google Fonts |
| Mono / Labels | DM Mono (300, 400) | Google Fonts |

```html
<!-- Load in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/the-seasons" rel="stylesheet">
```

**Usage rules:**
- `h1`–`h4`: `font-family: var(--font-display)`, `font-weight: 400`
- Body: `font-family: var(--font-body)`, `font-weight: 300`–`400`
- Prices, tags, labels: `font-family: var(--font-mono)`, `font-weight: 300`
- Uppercase text: always add `letter-spacing: var(--tracking-wider)`
- **No italics — ever.** Never set `font-style: italic` on any display or heading text.

#### Type Scale

```css
--font-display: 'The Seasons', Georgia, serif;
--font-body:    'Cormorant Garamond', Georgia, serif;
--font-mono:    'DM Mono', monospace;

--text-xs:   0.75rem;    /* 12px  — mono labels, tags */
--text-sm:   0.875rem;   /* 14px  — captions, metadata */
--text-base: 1.0625rem;  /* 17px  — body copy */
--text-lg:   1.25rem;    /* 20px  — lead text, card titles */
--text-xl:   1.625rem;   /* 26px  — section headings */
--text-2xl:  2.25rem;    /* 36px  — page headings */
--text-3xl:  3.25rem;    /* 52px  — hero title */
--text-4xl:  4.5rem;     /* 72px  — full-bleed display */

--leading-tight:  1.1;
--leading-normal: 1.55;
--leading-loose:  1.85;
--tracking-tight: -0.02em;
--tracking-wide:  0.08em;
--tracking-wider: 0.18em;
```

---

### 9.2 Color Palette

```css
:root {
  /* Backgrounds */
  --color-bg-base:    #14181a;   /* deep cool slate — page background */
  --color-bg-raised:  #1a2022;   /* cards, panels */
  --color-bg-overlay: #202830;   /* hover states, input fills */
  --color-bg-subtle:  #1e2628;   /* subtle section fills */

  /* Surface — light variant for inverted sections */
  --color-surface-light: #e8eeed;
  --color-surface-mid:   #d0d8d4;
  --color-surface-dim:   #b4c0bc;

  /* Primary accent — Moss Green */
  --color-accent:       #6a9e78;              /* CTAs, links, free tags */
  --color-accent-muted: #527a5e;              /* hover */
  --color-accent-soft:  rgba(106,158,120,0.14); /* tag bg, focus rings */
  --color-accent-glow:  rgba(106,158,120,0.07); /* subtle tints */

  /* Secondary accent — Slate Blue */
  --color-blue:         #6494a8;
  --color-blue-muted:   #4e7890;
  --color-blue-soft:    rgba(100,148,168,0.14);

  /* Tertiary — Pale Sage */
  --color-sage:         #8aab96;
  --color-sage-muted:   #6a8878;
  --color-sage-soft:    rgba(138,171,150,0.12);

  /* Text */
  --color-text-primary:   #d4dcd8;  /* cool off-white */
  --color-text-secondary: #6a8078;  /* muted teal-grey */
  --color-text-tertiary:  #3e5048;  /* placeholders, metadata */
  --color-text-inverted:  #14181a;  /* text on light surfaces */

  /* Borders */
  --color-border:        #242c2e;
  --color-border-muted:  #1c2426;
  --color-border-strong: #344038;

  /* Semantic */
  --color-success: #6a9e78;
  --color-warning: #a89060;
  --color-error:   #9e6060;
}
```

#### Light mode variant (inverted sections)

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

#### Quick Reference

| Token | Hex | Use for |
|---|---|---|
| `--color-bg-base` | `#14181a` | Page background |
| `--color-bg-raised` | `#1a2022` | Cards, panels |
| `--color-bg-overlay` | `#202830` | Hover, input fills |
| `--color-accent` | `#6a9e78` | CTAs, links, free tags, primary actions |
| `--color-accent-muted` | `#527a5e` | Accent hover |
| `--color-blue` | `#6494a8` | Secondary actions, paid tags, info |
| `--color-blue-muted` | `#4e7890` | Blue hover |
| `--color-sage` | `#8aab96` | Tertiary tags, soft highlights |
| `--color-text-primary` | `#d4dcd8` | Headings, important text |
| `--color-text-secondary` | `#6a8078` | Body copy, descriptions |
| `--color-text-tertiary` | `#3e5048` | Placeholders, metadata |
| `--color-border-muted` | `#1c2426` | Subtle dividers |
| `--color-border` | `#242c2e` | Standard card borders |
| `--color-border-strong` | `#344038` | Visible outlines, focused inputs |

---

### 9.3 Spacing & Layout

```css
--space-1:  0.25rem;   /*  4px */
--space-2:  0.5rem;    /*  8px */
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

--max-width:     1180px;
--content-width: 720px;
--gutter:        clamp(1.5rem, 5vw, 3rem);

--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 450ms cubic-bezier(0.16, 1, 0.3, 1);
```

---

### 9.4 Base Reset

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
  background-color: var(--color-bg-base);
}

a { color: var(--color-accent); text-decoration: none; transition: color var(--transition-fast); }
a:hover { color: var(--color-accent-muted); }
img, video { max-width: 100%; display: block; }
::selection { background: var(--color-accent-soft); color: var(--color-text-primary); }
```

---

### 9.5 Components

#### Buttons

```css
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

/* Primary — moss green */
.btn-primary { background: var(--color-accent); color: #14181a; border-color: var(--color-accent); }
.btn-primary:hover { background: var(--color-accent-muted); border-color: var(--color-accent-muted); transform: translateY(-1px); }

/* Secondary — outlined */
.btn-secondary { background: transparent; color: var(--color-text-primary); border-color: var(--color-border-strong); }
.btn-secondary:hover { border-color: var(--color-accent); color: var(--color-accent); }

/* Ghost */
.btn-ghost { background: transparent; color: var(--color-text-secondary); border-color: transparent; padding-left: 0; padding-right: 0; }
.btn-ghost:hover { color: var(--color-text-primary); }

/* Free */
.btn-free { background: var(--color-accent-soft); color: var(--color-accent); border-color: var(--color-accent-muted); }

/* Slate blue — paid/info */
.btn-blue { background: var(--color-blue-soft); color: var(--color-blue); border-color: var(--color-blue-muted); }
```

#### Tags / Badges

```css
.tag {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
}
.tag-default { background: var(--color-bg-overlay);   color: var(--color-text-secondary); }
.tag-accent  { background: var(--color-accent-soft);  color: var(--color-accent); }
.tag-free    { background: var(--color-accent-soft);  color: var(--color-accent); }
.tag-paid    { background: var(--color-blue-soft);    color: var(--color-blue); }
.tag-blue    { background: var(--color-blue-soft);    color: var(--color-blue); }
.tag-sage    { background: var(--color-sage-soft);    color: var(--color-sage); }
```

#### Product Card

```css
.card {
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-base), transform var(--transition-slow);
}
.card:hover { border-color: var(--color-border); transform: translateY(-4px); }

.card-cover { aspect-ratio: 16/9; background: var(--color-bg-overlay); overflow: hidden; position: relative; }
.card-body  { padding: var(--space-5) var(--space-5) var(--space-6); }

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
  font-weight: 400;          /* NO italics */
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}
.card-price      { font-family: var(--font-mono); font-size: var(--text-base); color: var(--color-text-primary); }
.card-price.free { color: var(--color-accent); font-size: var(--text-xs); letter-spacing: var(--tracking-wider); text-transform: uppercase; }
.card-footer     { display: flex; align-items: center; justify-content: space-between; padding-top: var(--space-4); border-top: 1px solid var(--color-border-muted); }
```

#### Navigation

```css
.nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4) var(--gutter);
  background: rgba(20,24,26,0.88);
  border-bottom: 1px solid var(--color-border-muted);
  backdrop-filter: blur(14px);
}
.nav-logo    { font-family: var(--font-display); font-size: var(--text-xl); color: var(--color-text-primary); font-weight: 400; /* NO italic */ }
.nav-links a { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-secondary); letter-spacing: var(--tracking-wider); text-transform: uppercase; }
.nav-links a:hover { color: var(--color-text-primary); }
```

#### Inputs

```css
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
.input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-soft); }
```

#### Layout Utilities

```css
.container   { width: 100%; max-width: var(--max-width); margin: 0 auto; padding: 0 var(--gutter); }
.section     { padding: var(--space-9) 0; }
.section-sm  { padding: var(--space-7) 0; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-6); }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-9); align-items: center; }
@media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }

.section-label {
  display: flex; align-items: center; gap: var(--space-4);
  font-family: var(--font-mono); font-size: var(--text-xs);
  color: var(--color-text-tertiary); letter-spacing: var(--tracking-wider); text-transform: uppercase;
  margin-bottom: var(--space-7);
}
.section-label::before, .section-label::after { content: ''; flex: 1; height: 1px; background: var(--color-border-muted); }
```

#### Atmosphere

```css
/* Hero background — cool moss + slate radial glow */
.hero-bg-slate {
  background:
    radial-gradient(ellipse 70% 60% at 60% 40%, rgba(106,158,120,0.07) 0%, transparent 65%),
    radial-gradient(ellipse 50% 50% at 15% 75%, rgba(100,148,168,0.06) 0%, transparent 60%),
    var(--color-bg-base);
}

/* Grain overlay — use sparingly on hero sections */
.grain-overlay { position: relative; }
.grain-overlay::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  opacity: 0.35; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
}
```

#### Animations

```css
/* Scroll reveal — add .visible via IntersectionObserver */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Stagger children */
.reveal-group > * { opacity: 0; transform: translateY(12px); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal-group.visible > *:nth-child(1) { transition-delay:   0ms; opacity: 1; transform: none; }
.reveal-group.visible > *:nth-child(2) { transition-delay:  80ms; opacity: 1; transform: none; }
.reveal-group.visible > *:nth-child(3) { transition-delay: 160ms; opacity: 1; transform: none; }
.reveal-group.visible > *:nth-child(4) { transition-delay: 240ms; opacity: 1; transform: none; }
```

---

### 9.6 Do's and Don'ts

| Do | Don't |
|---|---|
| The Seasons upright for all headings | `font-style: italic` on The Seasons — ever |
| Cormorant Garamond for body copy | Inter, Roboto, or system-ui |
| Slate & Moss palette only | Warm tones — terracotta, amber, burnt clay |
| DM Mono for prices, tags, labels | Serif or display font for UI labels |
| Generous whitespace, quiet layouts | Cluttered or dense sections |
| Moss `#6a9e78` as primary accent | Pure green or bright lime |
| Slate blue `#6494a8` as secondary accent | Vivid or saturated blue |
| `letter-spacing` on all uppercase mono text | Uppercase without tracking |
| Dark `#14181a` as page background | White or light backgrounds as default |
| Cool radial gradients only | Warm gradients, heavy shadows, glows |

---

## Appendix: SKILL.md

Save this file as `montnexus-design-system/SKILL.md` and install via Claude settings → Skills. Once installed, Claude reads it automatically before generating any frontend code for this project.

---

```yaml
---
name: montnexus-design-system
description: Build frontend UI for montnexus.shop using The Seasons font and the Slate & Moss design system. Use this skill whenever building any page, component, section, card, button, form, or layout for the montnexus project. Triggers on any request to build, design, style, or create UI for montnexus — including landing pages, product cards, checkout flows, dashboards, navigation, and hero sections. Always use this skill before writing any montnexus frontend code, even for small components.
---
```

*(Full SKILL.md content is in the separate `montnexus-design-system/SKILL.md` file delivered alongside this document.)*

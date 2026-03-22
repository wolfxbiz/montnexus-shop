# Montnexus — Developer Documentation

**montnexus.shop** · Creative Community Platform · Theme: Slate & Moss · v2.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Pages & Routes](#3-pages--routes)
4. [API Endpoints](#4-api-endpoints)
5. [Database Schema](#5-database-schema)
6. [Purchase & Download Flow](#6-purchase--download-flow)
7. [Mock Data System](#7-mock-data-system)
8. [Folder Structure](#8-folder-structure)
9. [Environment Variables](#9-environment-variables)
10. [Design System — Slate & Moss](#10-design-system--slate--moss)
11. [Mobile Optimisation](#11-mobile-optimisation)
12. [Launch Checklist](#12-launch-checklist)

---

## 1. Project Overview

Montnexus is a creative community platform for designers, developers, illustrators, writers, architects, engineers, professors, and teachers. It is not just a product store — it is an ecosystem where professionals build, learn, and grow.

| Property | Value |
|---|---|
| Domain | `montnexus.shop` |
| Tagline | Build, learn and grow |
| Target users | Designers, developers, illustrators, writers, architects, engineers, professors, teachers |
| Core pillars | Digital products · Services · Showcase · Articles |

### Four Platform Pillars

| Pillar | What it does | Key pages |
|---|---|---|
| **Digital Products** | Buy and download UI kits, code templates, eBooks, icon packs, Notion templates | `/bundles`, `/bundles/[slug]` |
| **Services** | Hire creators for design, dev, writing, consulting, audio-video | `/services`, `/services/[slug]` |
| **Showcase** | Community visual feed — share work, get inspired, like posts | `/showcase`, `/showcase/[id]` |
| **Articles** | Long-form guides and tutorials written by community creators | `/articles`, `/articles/[slug]` |

---

## 2. Tech Stack

| Technology | Role |
|---|---|
| **Next.js 14** (App Router) | Frontend framework — SSR, API routes, server components, file-based routing |
| **TypeScript** | End-to-end type safety across frontend and API layer |
| **Tailwind CSS + CSS custom properties** | Utility classes + Slate & Moss design tokens |
| **Supabase** | PostgreSQL database + Auth (email, magic link, Google OAuth) + Storage |
| **Stripe** | Checkout sessions for paid products and service orders |
| **Resend** | Transactional email — receipts, download links, notifications |
| **Vercel** | Hosting + CDN edge deployment, CI/CD from GitHub `main` branch |

### Rendering strategy

| Page type | Strategy | Why |
|---|---|---|
| Home, Articles, Showcase, Services | `force-dynamic` | Real-time data, personalisation |
| Bundle detail, Service detail | ISR (static + revalidate) | Infrequent changes, SEO-critical |
| Dashboard pages | `force-dynamic` + auth guard | User-specific content |
| API routes | Server-side only | Never run in browser |

---

## 3. Pages & Routes

### Public pages

| Route | Component | Purpose |
|---|---|---|
| `/` | `app/(site)/page.tsx` | Landing page — hero, how it works, featured products, services carousel, showcase feed, articles |
| `/bundles` | `app/(site)/bundles/page.tsx` | Browse all products — filter by category, free/paid |
| `/bundles/[slug]` | `app/(site)/bundles/[slug]/page.tsx` | Product detail — cover, description, tiers, buy/download CTA |
| `/services` | `app/(site)/services/page.tsx` | Browse all services — filter by category |
| `/services/[slug]` | `app/(site)/services/[slug]/page.tsx` | Service detail — description, creator profile, 3-tier pricing table |
| `/showcase` | `app/(site)/showcase/page.tsx` | Community visual feed — tag filters, masonry grid |
| `/showcase/[id]` | `app/(site)/showcase/[id]/page.tsx` | Single showcase post — image, like button, tags, creator |
| `/articles` | `app/(site)/articles/page.tsx` | Articles grid — all published articles |
| `/articles/[slug]` | `app/(site)/articles/[slug]/page.tsx` | Article reader — cover, author, content |
| `/creators` | `app/(site)/creators/page.tsx` | Creator directory |
| `/creators/[username]` | `app/(site)/creators/[username]/page.tsx` | Creator profile — bio, products, services, showcase |
| `/checkout/[productId]` | `app/(site)/checkout/[productId]/page.tsx` | Stripe redirect |
| `/checkout/success` | `app/(site)/checkout/success/page.tsx` | Post-payment confirmation + download link |

### Auth pages

| Route | Purpose |
|---|---|
| `/auth/login` | Sign in — email + Google OAuth |
| `/auth/signup` | Register — email |
| `/auth/callback` | Supabase OAuth callback handler |

### Dashboard pages (protected — requires auth)

| Route | Purpose |
|---|---|
| `/dashboard` | Overview — tabs for orders, services, showcase, articles |
| `/dashboard/products/new` | Upload and publish a new digital product |
| `/dashboard/services/new` | Create a new service listing with 3 pricing tiers |
| `/dashboard/showcase/new` | Upload showcase images with caption and tags |
| `/dashboard/articles/new` | Write and publish an article |
| `/dashboard/profile/edit` | Edit creator profile — bio, avatar, links |
| `/dashboard/become-creator` | Apply to become a creator |

---

## 4. API Endpoints

All routes live under `app/api/`. All mutating routes require authentication via Supabase session cookie. All server routes use `createServiceClient()` (service role) for privileged operations.

### Products

| Method | Endpoint | Behaviour |
|---|---|---|
| `GET` | `/api/products` | List products. Supports `?category=`, `?free=true`, `?creator_id=` |
| `GET` | `/api/products/[slug]` | Single product detail |
| `POST` | `/api/checkout` | Create Stripe Checkout session for paid product |
| `POST` | `/api/checkout/free` | Claim free product — writes order row, returns download token |
| `POST` | `/api/webhook` | Stripe webhook — on `checkout.session.completed`, marks order paid, creates download token |
| `GET` | `/api/download/[token]` | Validate token → return 15-min signed Supabase Storage URL |

### Services

| Method | Endpoint | Behaviour |
|---|---|---|
| `GET` | `/api/services` | List services. Supports `?category=`, `?creator_id=` |
| `POST` | `/api/services` | Create new service + tiers. Requires creator profile |
| `GET` | `/api/services/[slug]` | Single service with tiers and creator |
| `PATCH` | `/api/services/[slug]` | Update service. Owner only (verified via `creators.user_id`) |
| `POST` | `/api/services/[slug]/order` | Place a service order. Validates tier, prevents self-ordering, calculates due date |

### Showcase

| Method | Endpoint | Behaviour |
|---|---|---|
| `GET` | `/api/showcase` | List posts. Supports `?tag=`, `?cursor=` (pagination), `?limit=` |
| `POST` | `/api/showcase` | Create new post + media. Requires creator profile |
| `GET` | `/api/showcase/[id]` | Single post with like count and `liked_by_user` |
| `DELETE` | `/api/showcase/[id]` | Delete post. Owner only |
| `POST` | `/api/showcase/[id]/like` | Toggle like. Returns `{ liked: boolean, like_count: number }` |

### Articles

| Method | Endpoint | Behaviour |
|---|---|---|
| `GET` | `/api/articles` | List published articles with creator info |
| `POST` | `/api/articles` | Create article draft. Requires creator |
| `GET` | `/api/articles/[slug]` | Single article |
| `PATCH` | `/api/articles/[slug]` | Update / publish article. Owner only |

### Creators

| Method | Endpoint | Behaviour |
|---|---|---|
| `GET` | `/api/creators` | List all creators |
| `GET` | `/api/creators/[username]` | Creator profile + products + services + showcase |

> **Security rules:**
> - `/api/webhook` must verify `stripe-signature` header on every call
> - `/api/download/[token]` must confirm token belongs to the requesting user
> - All PATCH/DELETE routes verify `creators.user_id = auth.uid()` before allowing changes
> - `SUPABASE_SERVICE_ROLE_KEY` is used server-side only — never exposed to client

---

## 5. Database Schema

PostgreSQL via Supabase. All tables use UUID primary keys. Row Level Security (RLS) is enabled on every table.

### `products`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `title` | `text` | NOT NULL |
| `slug` | `text` | UNIQUE NOT NULL |
| `description` | `text` | Long-form copy |
| `short_desc` | `text` | One-line card description |
| `category` | `text` | `design` \| `dev` \| `ebook` \| `template` \| `icon` |
| `price_cents` | `integer` | `0` = free |
| `is_free` | `boolean` | Derived from `price_cents = 0` |
| `file_path` | `text` | Storage path — **never sent to client** |
| `cover_url` | `text` | Public cover image URL |
| `file_count` | `integer` | Number of files in bundle |
| `published` | `boolean` | Draft/publish control |
| `created_at` | `timestamptz` | `default now()` |

### `orders`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `product_id` | `uuid` | FK → `products.id` |
| `stripe_session_id` | `text` | Null for free orders |
| `stripe_payment_intent` | `text` | Null for free orders |
| `amount_cents` | `integer` | `0` for free |
| `status` | `text` | `pending` \| `paid` \| `free` \| `refunded` |
| `created_at` | `timestamptz` | |

### `downloads`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `order_id` | `uuid` | FK → `orders.id` UNIQUE |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `product_id` | `uuid` | FK → `products.id` |
| `token` | `text` | UNIQUE — random 64-char hex |
| `expires_at` | `timestamptz` | Reset to `now() + 15min` on each use |
| `download_count` | `integer` | `default 0` |
| `created_at` | `timestamptz` | |

### `profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY — matches `auth.users.id` |
| `display_name` | `text` | Optional |
| `avatar_url` | `text` | Optional |
| `stripe_customer_id` | `text` | Set on first Stripe purchase |
| `newsletter` | `boolean` | `default false` |
| `updated_at` | `timestamptz` | |

### `creators`

Extends `profiles` for users who create and sell content.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `user_id` | `uuid` | FK → `auth.users.id` UNIQUE |
| `username` | `text` | UNIQUE — URL slug |
| `display_name` | `text` | NOT NULL |
| `bio` | `text` | Optional |
| `avatar_url` | `text` | Optional |
| `website` | `text` | Optional |
| `twitter` | `text` | Optional |
| `total_products` | `integer` | `default 0` — denormalised count |
| `total_sales` | `integer` | `default 0` — denormalised count |
| `created_at` | `timestamptz` | |

### `services`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `creator_id` | `uuid` | FK → `creators.id` |
| `title` | `text` | NOT NULL |
| `slug` | `text` | UNIQUE NOT NULL |
| `description` | `text` | Long-form copy |
| `short_desc` | `text` | Card description |
| `category` | `text` | `design` \| `dev` \| `consulting` \| `writing` \| `audio-video` |
| `cover_url` | `text` | |
| `delivery_time_days` | `integer` | Default delivery time |
| `published` | `boolean` | `default true` |
| `created_at` | `timestamptz` | |

### `service_tiers`

Each service has exactly 3 tiers: `basic`, `standard`, `premium`.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `service_id` | `uuid` | FK → `services.id` ON DELETE CASCADE |
| `name` | `text` | `basic` \| `standard` \| `premium` |
| `title` | `text` | Display title e.g. "Logo + Brand Kit" |
| `description` | `text` | One-line tier description |
| `price_cents` | `integer` | NOT NULL |
| `delivery_time_days` | `integer` | NOT NULL |
| `revisions` | `integer` | Number of revisions included |
| `features` | `text[]` | Feature bullet list |

### `service_orders`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `service_id` | `uuid` | FK → `services.id` |
| `tier_id` | `uuid` | FK → `service_tiers.id` |
| `client_id` | `uuid` | FK → `auth.users.id` — buyer |
| `creator_id` | `uuid` | FK → `creators.id` — seller |
| `status` | `text` | `inquiry` → `accepted` → `in_progress` → `delivered` → `revision` → `completed` \| `cancelled` |
| `brief` | `text` | Client's project brief |
| `amount_cents` | `integer` | Price at time of order |
| `due_date` | `timestamptz` | Calculated from order date + tier delivery days |
| `created_at` | `timestamptz` | |

### `service_messages`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `order_id` | `uuid` | FK → `service_orders.id` |
| `sender_id` | `uuid` | FK → `auth.users.id` |
| `body` | `text` | Message content |
| `created_at` | `timestamptz` | |

### `showcase_posts`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `creator_id` | `uuid` | FK → `creators.id` |
| `caption` | `text` | `default ''` |
| `tags` | `text[]` | GIN index for fast tag filtering |
| `published` | `boolean` | `default true` |
| `created_at` | `timestamptz` | |

### `showcase_media`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `post_id` | `uuid` | FK → `showcase_posts.id` ON DELETE CASCADE |
| `media_url` | `text` | NOT NULL |
| `media_type` | `text` | `image` \| `video` |
| `width` | `integer` | Original dimensions |
| `height` | `integer` | |
| `sort_order` | `integer` | `default 0` |
| `created_at` | `timestamptz` | |

### `showcase_likes`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `post_id` | `uuid` | FK → `showcase_posts.id` ON DELETE CASCADE |
| `user_id` | `uuid` | FK → `auth.users.id` ON DELETE CASCADE |
| `created_at` | `timestamptz` | |
| — | UNIQUE | `(post_id, user_id)` — prevents duplicate likes |

### `articles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `creator_id` | `uuid` | FK → `creators.id` |
| `title` | `text` | NOT NULL |
| `slug` | `text` | UNIQUE NOT NULL |
| `excerpt` | `text` | One-paragraph summary |
| `content` | `text` | Full article body (markdown) |
| `cover_url` | `text` | Optional cover image |
| `published` | `boolean` | `default false` |
| `published_at` | `timestamptz` | Set when first published |
| `created_at` | `timestamptz` | |

### RLS policy summary

| Table | Public read | Authenticated write |
|---|---|---|
| `products` | Published only | Creator owns (`products.creator_id`) |
| `services` | Published only | Creator owns |
| `service_tiers` | If service published | Creator owns via service |
| `service_orders` | Client sees own; creator sees for their services | Client creates; creator updates status |
| `service_messages` | Order participants only | Order participants |
| `showcase_posts` | Published only | Creator owns |
| `showcase_media` | If post published | Creator owns via post |
| `showcase_likes` | Everyone | Authenticated — own likes only |
| `articles` | Published only | Creator owns |
| `creators` | Everyone | Own row only |
| `profiles` | Own row | Own row |
| `orders` | Own row | — (written by API) |
| `downloads` | Own row | — (written by API) |

### SQL Migrations — run in order

```
supabase/migrations/
├── 001_products.sql
├── 002_orders.sql
├── 003_downloads.sql
├── 004_profiles.sql
├── 005_rls_policies.sql
├── 006_creators.sql
├── 007_articles.sql
├── 008_admin.sql
├── 009_services.sql      ← Services + tiers + orders + messages
└── 010_showcase.sql      ← Showcase posts + media + likes
```

> **Important:** Run `009_services.sql` and `010_showcase.sql` in your Supabase dashboard before launch. Without these, the services and showcase features have no real tables to write to.

---

## 6. Purchase & Download Flow

### Paid product

```
User clicks "Buy"
  → POST /api/checkout
  → Stripe Checkout session created
  → User completes payment on Stripe-hosted page
  → Stripe fires checkout.session.completed webhook
  → POST /api/webhook verifies stripe-signature
  → Order row created (status: paid)
  → Downloads row created with secure token
  → Resend sends receipt email with download link
  → User lands on /checkout/success
  → User clicks download → GET /api/download/[token]
  → Token validated, expires_at refreshed to now() + 15min
  → Signed Supabase Storage URL returned
  → Browser downloads file directly from storage
```

### Free product

```
User clicks "Download free"
  → POST /api/checkout/free
  → Auth check (must be signed in)
  → Order row created (status: free)
  → Downloads row created with token
  → Token returned in response
  → Frontend calls GET /api/download/[token]
  → Signed URL returned immediately
  → Browser downloads file
```

### Service order

```
Client selects a tier on /services/[slug]
  → POST /api/services/[slug]/order
  → Validates: service published, tier belongs to service, not self-ordering
  → Creates service_order (status: inquiry)
  → Due date = created_at + tier.delivery_time_days
  → Creator notified (TODO: Resend email)
  → Status flow: inquiry → accepted → in_progress → delivered → revision → completed
```

### Showcase like (optimistic UI)

```
User clicks LikeButton (client component)
  → Optimistic update: toggle UI state immediately
  → POST /api/showcase/[id]/like
  → Server checks existing like: DELETE if found (unlike), INSERT if not (like)
  → Returns { liked: boolean, like_count: number }
  → UI synced to server state; reverts on error
```

---

## 7. Mock Data System

All pages use real Supabase data with mock data as a fallback. This means the site works fully during development and pre-launch without any data in the database.

### Mock files

| File | Records | Used as fallback in |
|---|---|---|
| `lib/mock-products.ts` | 75 products | `/bundles`, `/` |
| `lib/mock-services.ts` | 25 services with tiers | `/services`, `/` |
| `lib/mock-showcase.ts` | 60 showcase posts | `/showcase`, `/` |
| `lib/mock-articles.ts` | 90 articles | `/articles`, `/` |
| `lib/mock-creators.ts` | 100 creators | `/creators` |

### How the fallback pattern works

Every data-fetching function follows this exact pattern:

```ts
async function getArticles(): Promise<Article[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('articles')
      .select('*, creator:creators(id, username, display_name, avatar_url)')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error || !data || data.length === 0) return mockArticles  // ← fallback
    return data as Article[]
  } catch {
    return mockArticles  // ← fallback on connection error
  }
}
```

The mock data is **never shown to real users**. The moment Supabase returns actual records, `data.length === 0` becomes `false` and the mock branch is never reached.

### Removing mock data at launch

When you have 100–200 real creators and users, removing mock data is safe and straightforward:

**Step 1 — Change the fallback to return empty arrays**

In each page's fetch function, change:
```ts
if (error || !data || data.length === 0) return mockArticles
```
to:
```ts
if (error || !data || data.length === 0) return []
```

Do this in these 6 files:
- `app/(site)/page.tsx`
- `app/(site)/articles/page.tsx`
- `app/(site)/services/page.tsx`
- `app/(site)/services/[slug]/page.tsx`
- `app/(site)/showcase/page.tsx`
- `app/(site)/showcase/[id]/page.tsx`

**Step 2 — Delete the mock files**

```
lib/mock-products.ts
lib/mock-services.ts
lib/mock-showcase.ts
lib/mock-articles.ts
lib/mock-creators.ts
```

TypeScript will immediately flag every remaining import so nothing is missed.

**What is NOT affected:** Real user accounts, orders, service requests, likes, downloads — all stored in Supabase and completely untouched by this process.

---

## 8. Folder Structure

```
montnexus-shop/
│
├── app/
│   ├── (site)/                           # All public-facing pages
│   │   ├── page.tsx                      # / — Landing page
│   │   ├── bundles/
│   │   │   ├── page.tsx                  # /bundles
│   │   │   └── [slug]/page.tsx           # /bundles/[slug]
│   │   ├── services/
│   │   │   ├── page.tsx                  # /services
│   │   │   └── [slug]/page.tsx           # /services/[slug]
│   │   ├── showcase/
│   │   │   ├── page.tsx                  # /showcase
│   │   │   └── [id]/page.tsx             # /showcase/[id]
│   │   ├── articles/
│   │   │   ├── page.tsx                  # /articles
│   │   │   └── [slug]/page.tsx           # /articles/[slug]
│   │   ├── creators/
│   │   │   ├── page.tsx                  # /creators
│   │   │   └── [username]/page.tsx       # /creators/[username]
│   │   └── checkout/
│   │       ├── [productId]/page.tsx
│   │       └── success/page.tsx
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/page.tsx
│   │
│   ├── dashboard/
│   │   ├── page.tsx                      # Dashboard overview (tabbed)
│   │   ├── products/new/page.tsx         # Upload a product
│   │   ├── services/new/page.tsx         # Create a service listing
│   │   ├── showcase/new/page.tsx         # Upload a showcase post
│   │   ├── articles/new/page.tsx         # Write an article
│   │   ├── profile/edit/page.tsx         # Edit creator profile
│   │   └── become-creator/page.tsx       # Creator application
│   │
│   └── api/
│       ├── products/
│       │   ├── route.ts                  # GET /api/products
│       │   └── [slug]/route.ts           # GET /api/products/[slug]
│       ├── checkout/
│       │   ├── route.ts                  # POST /api/checkout (Stripe)
│       │   └── free/route.ts             # POST /api/checkout/free
│       ├── webhook/route.ts              # POST /api/webhook (Stripe)
│       ├── download/[token]/route.ts     # GET /api/download/[token]
│       ├── services/
│       │   ├── route.ts                  # GET + POST /api/services
│       │   └── [slug]/
│       │       ├── route.ts              # GET + PATCH /api/services/[slug]
│       │       └── order/route.ts        # POST /api/services/[slug]/order
│       ├── showcase/
│       │   ├── route.ts                  # GET + POST /api/showcase
│       │   └── [id]/
│       │       ├── route.ts              # GET + DELETE /api/showcase/[id]
│       │       └── like/route.ts         # POST /api/showcase/[id]/like
│       ├── articles/
│       │   ├── route.ts                  # GET + POST /api/articles
│       │   └── [slug]/route.ts           # GET + PATCH /api/articles/[slug]
│       └── creators/
│           ├── route.ts                  # GET /api/creators
│           └── [username]/route.ts       # GET /api/creators/[username]
│
├── components/
│   ├── ui/                               # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx                      # Product card
│   │   ├── ServiceCard.tsx               # Service listing card
│   │   ├── ShowcaseItem.tsx              # Masonry showcase card
│   │   ├── LikeButton.tsx                # Optimistic like toggle (client)
│   │   ├── TierTable.tsx                 # 3-column pricing table
│   │   ├── Tag.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   ├── Nav.tsx                       # Sticky nav with hamburger (mobile)
│   │   └── Footer.tsx
│   └── sections/                         # Homepage section components
│       ├── Hero.tsx                      # Typewriter hero (client)
│       ├── HowItWorks.tsx                # 4-pillar platform overview
│       ├── ProductGrid.tsx               # Product card grid with "View all" link
│       ├── ServiceGrid.tsx               # Service card grid with "View all" link
│       ├── ServicesHero.tsx              # Auto-sliding services carousel (client)
│       ├── ShowcaseFeed.tsx              # Masonry showcase section
│       ├── ArticlesFeed.tsx              # Article card grid
│       ├── CtaBanner.tsx                 # Full-platform final CTA
│       └── Newsletter.tsx                # Email signup (client)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser Supabase client
│   │   └── server.ts                     # Server Supabase client (service role)
│   ├── stripe/index.ts
│   ├── resend/
│   │   ├── index.ts
│   │   └── templates/PurchaseEmail.tsx
│   ├── mock-products.ts                  # 75 product records — fallback only
│   ├── mock-services.ts                  # 25 services with tiers — fallback only
│   ├── mock-showcase.ts                  # 60 showcase posts — fallback only
│   ├── mock-articles.ts                  # 90 articles — fallback only
│   └── mock-creators.ts                  # 100 creators — fallback only
│
├── styles/
│   └── globals.css                       # Full Slate & Moss design system + responsive CSS
│
├── supabase/
│   └── migrations/                       # SQL — run in Supabase dashboard in order
│       ├── 001_products.sql
│       ├── 002_orders.sql
│       ├── 003_downloads.sql
│       ├── 004_profiles.sql
│       ├── 005_rls_policies.sql
│       ├── 006_creators.sql
│       ├── 007_articles.sql
│       ├── 008_admin.sql
│       ├── 009_services.sql              ← Must run before services go live
│       └── 010_showcase.sql              ← Must run before showcase goes live
│
├── types/
│   └── index.ts                          # All shared TypeScript interfaces
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                            # Never commit this file
```

---

## 9. Environment Variables

```bash
# .env.local — never commit, never expose to client

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key          # safe for client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key      # server only

# Stripe
STRIPE_SECRET_KEY=sk_live_...                        # server only
STRIPE_WEBHOOK_SECRET=whsec_...                      # server only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...       # safe for client

# Email
RESEND_API_KEY=re_...                                # server only

# App
NEXT_PUBLIC_SITE_URL=https://montnexus.shop
```

**Rule:** Any variable without `NEXT_PUBLIC_` is server-only. Never reference it in a client component (`'use client'`) or include it in an API response payload.

---

## 10. Design System — Slate & Moss

**Active theme: Slate & Moss.** All tokens are final. No warm tones. No italics on The Seasons typeface — upright only at all times.

### Typography

| Role | Font | Source |
|---|---|---|
| Display / Headings | The Seasons | `fonts.cdnfonts.com/css/the-seasons` |
| Body / UI | Cormorant Garamond (300, 400, 500) | Google Fonts |
| Mono / Labels / Tags | DM Mono (300, 400) | Google Fonts |

**Rules:**
- `h1`–`h4`: `font-family: var(--font-display)`, `font-weight: 400`
- Body: `font-family: var(--font-body)`, `font-weight: 300`–`400`
- Prices, tags, labels, nav links: `font-family: var(--font-mono)`
- All uppercase text: `letter-spacing: var(--tracking-wider)`
- **No `font-style: italic` ever** — especially not on The Seasons

### Type scale

```css
--text-xs:   0.75rem;    /* 12px  — mono labels, tags */
--text-sm:   0.875rem;   /* 14px  — captions, metadata */
--text-base: 1.0625rem;  /* 17px  — body copy */
--text-lg:   1.25rem;    /* 20px  — lead text */
--text-xl:   1.625rem;   /* 26px  — section headings */
--text-2xl:  2.25rem;    /* 36px  — page headings */
--text-3xl:  3.25rem;    /* 52px  — hero title */
--text-4xl:  4.5rem;     /* 72px  — full-bleed display */
```

### Colour palette

```css
/* Backgrounds */
--color-bg-base:    #14181a;
--color-bg-raised:  #1a2022;
--color-bg-overlay: #202830;

/* Accent — Moss Green (primary) */
--color-accent:       #6a9e78;
--color-accent-muted: #527a5e;
--color-accent-soft:  rgba(106,158,120,0.14);
--color-accent-glow:  rgba(106,158,120,0.07);

/* Secondary — Slate Blue */
--color-blue:       #6494a8;
--color-blue-soft:  rgba(100,148,168,0.14);

/* Tertiary — Pale Sage */
--color-sage:       #8aab96;
--color-sage-soft:  rgba(138,171,150,0.12);

/* Text */
--color-text-primary:   #d4dcd8;
--color-text-secondary: #6a8078;
--color-text-tertiary:  #3e5048;

/* Borders */
--color-border:        #242c2e;
--color-border-muted:  #1c2426;
--color-border-strong: #344038;
```

### Spacing

```css
--space-1: 0.25rem;   --space-6: 2rem;
--space-2: 0.5rem;    --space-7: 3rem;
--space-3: 0.75rem;   --space-8: 4rem;
--space-4: 1rem;      --space-9: 6rem;
--space-5: 1.5rem;    --space-10: 8rem;

--radius-sm: 4px;  --radius-lg: 14px;
--radius-md: 8px;  --radius-xl: 22px;  --radius-full: 9999px;

--max-width:     1180px;
--content-width: 720px;
--gutter:        clamp(1.5rem, 5vw, 3rem);

--transition-fast: 150ms ease;
--transition-base: 250ms ease;
```

### Do's and Don'ts

| Do | Don't |
|---|---|
| The Seasons upright for all headings | `font-style: italic` on any heading |
| Cormorant Garamond for body copy | Inter, Roboto, or system-ui |
| Slate & Moss palette only | Warm tones — terracotta, amber, orange |
| DM Mono for prices, tags, labels, nav | Serif or display font for UI labels |
| `letter-spacing: var(--tracking-wider)` on all uppercase text | Uppercase without tracking |
| Cool radial gradients only | Warm gradients, heavy shadows |
| Dark `#14181a` as page background | Light or white backgrounds as default |
| Moss `#6a9e78` as primary CTA colour | Bright green, lime, or neon |

---

## 11. Mobile Optimisation

The site is fully mobile-optimised. All breakpoints are in `styles/globals.css`.

### Breakpoints

| Breakpoint | Changes |
|---|---|
| `max-width: 768px` | Hamburger nav, single-column grids, reduced type scale, stacked footers |
| `max-width: 480px` | Further reduced type, tighter gutter, compact cards |

### Key mobile rules

- All touch targets are minimum 44px (buttons, nav links, tags)
- Nav collapses to a hamburger with smooth dropdown — `Nav.tsx` uses `useState(open)`
- `ServicesHero` hides the decorative right-side card on mobile, text stacks full-width
- All grid sections use `repeat(auto-fill, minmax(..., 1fr))` — never fixed columns
- Fluid type with `clamp()` on all major headings
- `viewport` meta is exported from `app/layout.tsx` as `export const viewport: Viewport`

---

## 12. Launch Checklist

### Before going live

- [ ] Run `009_services.sql` in Supabase dashboard
- [ ] Run `010_showcase.sql` in Supabase dashboard
- [ ] Set all environment variables in Vercel dashboard (see Section 9)
- [ ] Configure Stripe webhook endpoint: `https://montnexus.shop/api/webhook`
- [ ] Add Supabase storage bucket `Products` — set to **private**
- [ ] Verify `next.config.mjs` has correct `remotePatterns` for your image domains
- [ ] Test a paid checkout end-to-end in Stripe test mode
- [ ] Test a free download end-to-end
- [ ] Test creator signup flow (`/dashboard/become-creator`)
- [ ] Test service order placement (`/services/[slug]`)
- [ ] Test showcase post upload (`/dashboard/showcase/new`)

### When you have 100–200 real creators (remove mock data)

- [ ] In each fetch function, change `return mockArticles` / `return mockServices` etc. to `return []`
- [ ] Delete `lib/mock-products.ts`, `lib/mock-services.ts`, `lib/mock-showcase.ts`, `lib/mock-articles.ts`, `lib/mock-creators.ts`
- [ ] Remove mock imports from `app/(site)/page.tsx` and all section pages
- [ ] Run `npm run build` — TypeScript will flag any remaining references
- [ ] Deploy — real users and data are completely unaffected

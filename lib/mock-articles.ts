import type { Article } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString() }

const IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
  'https://images.unsplash.com/photo-1545665277-5937489579f2?w=800&q=80',
]

function creator(id: string, username: string, displayName: string, bio: string) {
  return { id, user_id: `u${id}`, username, display_name: displayName, bio, avatar_url: null, website: null, twitter: null, total_products: 0, total_sales: 0, total_products_count: 0, created_at: daysAgo(300) }
}

const CREATORS = [
  creator('c1',  'elena-design',  'Elena Vasquez',  'Brand designer & illustrator'),
  creator('c2',  'kai-dev',       'Kai Nakamura',   'Senior frontend engineer'),
  creator('c3',  'sam-ux',        'Sam Torres',     'Product designer — developer tools'),
  creator('c4',  'mira-design',   'Mira Chen',      'Mobile UI designer'),
  creator('c5',  'noah-framer',   'Noah Eriksson',  'Framer expert & no-code builder'),
  creator('c6',  'pia-writes',    'Pia Lindqvist',  'SEO content strategist & writer'),
  creator('c7',  'leo-video',     'Leo Osei',       'Video editor & motion designer'),
  creator('c8',  'zoe-webflow',   'Zoe Fischer',    'Webflow developer'),
  creator('c9',  'finn-audio',    'Finn Walsh',     'Podcast editor & audio engineer'),
  creator('c10', 'ravi-writes',   'Ravi Patel',     'Developer advocate & technical writer'),
]

interface Def { title: string; slug: string; excerpt: string; creatorIdx: number }

const DEFS: Def[] = [
  // Design
  { title:'How I built a design system that scales', slug:'how-i-built-a-design-system-that-scales', excerpt:'A practical breakdown of the decisions behind building a token-based design system that works across products and teams.', creatorIdx:0 },
  { title:'The case for boring design', slug:'the-case-for-boring-design', excerpt:'Why "boring" design choices — consistent spacing, predictable patterns, and unsexy components — are often the best decisions you can make.', creatorIdx:0 },
  { title:'How to write a design case study that wins clients', slug:'how-to-write-a-design-case-study-that-wins-clients', excerpt:'Most design case studies are just portfolio screenshots with captions. Here is how to write one that tells the story of how you think and solve problems.', creatorIdx:3 },
  { title:'My Figma workflow in 2025', slug:'my-figma-workflow-2025', excerpt:'Variables, auto-layout, components, and a branching strategy that keeps our team from stepping on each other. My current working setup.', creatorIdx:0 },
  { title:'Typography choices that define your brand', slug:'typography-choices-that-define-your-brand', excerpt:'Font selection is one of the first and most lasting decisions you make for a brand. How I approach it and the questions I ask before opening Fontpair.', creatorIdx:3 },
  { title:'Designing for accessibility without ruining aesthetics', slug:'designing-for-accessibility-without-ruining-aesthetics', excerpt:'WCAG compliance and beautiful design are not opposites. A practical guide to contrast ratios, focus states, and typography that works for everyone.', creatorIdx:2 },
  { title:'The truth about design systems at startups', slug:'truth-about-design-systems-startups', excerpt:'Design systems are expensive to build and hard to maintain. Here is when they actually make sense — and when you should wait.', creatorIdx:2 },
  { title:'Icon design principles I wish someone had told me', slug:'icon-design-principles', excerpt:'Consistency, optical sizing, grid alignment, and metaphor clarity. The principles behind icons that work across sizes and contexts.', creatorIdx:0 },
  { title:'Colour systems beyond primary/secondary/accent', slug:'colour-systems-beyond-primary-secondary-accent', excerpt:'How to build a semantic colour system that communicates meaning, supports dark mode, and maps cleanly to CSS custom properties.', creatorIdx:3 },
  { title:'Mobile-first is not just a CSS trick', slug:'mobile-first-is-not-just-a-css-trick', excerpt:'Mobile-first design starts in the wireframe, not the media query. How rethinking layout hierarchy changed how I approach every new screen.', creatorIdx:2 },

  // Dev
  { title:"The freelance developer's pricing guide", slug:'freelance-developer-pricing-guide', excerpt:'Stop undercharging. Here is how to price your dev work confidently based on value, not hours.', creatorIdx:1 },
  { title:'Why I switched from Redux to Zustand (and back)', slug:'why-i-switched-from-redux-to-zustand', excerpt:'State management is one of those choices you live with for years. My honest experience bouncing between libraries on a mid-size production app.', creatorIdx:1 },
  { title:'Next.js App Router patterns I use in every project', slug:'nextjs-app-router-patterns', excerpt:'After a year building production apps with the App Router, these are the patterns I reach for on every project — layouts, loading states, and data fetching.', creatorIdx:4 },
  { title:'Building a real-time app without WebSockets', slug:'real-time-app-without-websockets', excerpt:'Server-Sent Events, long polling, and SWR: the full comparison with benchmarks and when to reach for each approach.', creatorIdx:1 },
  { title:'The TypeScript generics mental model', slug:'typescript-generics-mental-model', excerpt:'Generics are not scary once you build the right mental model. A practical guide using real-world API types as examples.', creatorIdx:9 },
  { title:'How I structure large Next.js codebases', slug:'how-i-structure-large-nextjs-codebases', excerpt:'Folder structure, barrel files, shared utilities, and the conventions that have survived 3 years of team growth on our main Next.js app.', creatorIdx:4 },
  { title:'What nobody tells you about shipping to production', slug:'what-nobody-tells-you-about-shipping-to-production', excerpt:'The gap between "works in dev" and "ready for real users" is bigger than most tutorials admit. What I check before every production deploy.', creatorIdx:1 },
  { title:'Optimistic UI patterns that actually work', slug:'optimistic-ui-patterns-that-actually-work', excerpt:'How to implement optimistic updates that feel instant, revert correctly on failure, and do not break on slow connections.', creatorIdx:1 },
  { title:'React Server Components one year in', slug:'react-server-components-one-year-in', excerpt:'An honest review of RSC after building with them in production for twelve months — the wins, the footguns, and what I would change.', creatorIdx:4 },
  { title:'CSS Grid layouts I actually use', slug:'css-grid-layouts-i-actually-use', excerpt:'Not every layout trick from the CSS Grid spec — just the six patterns that solve 90% of my layout problems in real projects.', creatorIdx:1 },

  // Freelancing & business
  { title:'How I went from $20/hr to $150/hr in two years', slug:'freelance-rate-journey', excerpt:'Not a hustle story. A systematic breakdown of the positioning, portfolio, and outreach changes that moved the needle on my freelance rate.', creatorIdx:5 },
  { title:'Client red flags I ignored (and regretted)', slug:'client-red-flags-i-ignored', excerpt:'Every bad project had warning signs in the first call. The patterns I now screen for before signing any contract.', creatorIdx:5 },
  { title:'How to write a proposal that closes', slug:'how-to-write-a-proposal-that-closes', excerpt:"Proposals that close do three things: reflect the client's problem back to them, show a clear path forward, and pre-empt the main objection.", creatorIdx:5 },
  { title:'Building a second income stream as a developer', slug:'second-income-stream-developer', excerpt:'Digital products, templates, consulting, and creator monetisation — what I tried, what worked, and how much each stream actually earns.', creatorIdx:9 },
  { title:'The studio model: scaling a design business without hiring', slug:'studio-model-scale-without-hiring', excerpt:'How productising your services, raising prices, and subcontracting on your terms lets you scale revenue without building a full agency.', creatorIdx:3 },
  { title:'Retainer clients: how to get them and keep them', slug:'retainer-clients-how-to-get-them', excerpt:'Retainers smooth out freelance income volatility. The positioning and proposal strategy that turned three one-off clients into monthly retainers.', creatorIdx:5 },
  { title:'Niching down was the best thing I did for my freelance career', slug:'niching-down-freelance-career', excerpt:'Narrowing from "web developer" to "Next.js developer for B2B SaaS" tripled my inbound and doubled my rate. Why specificity sells.', creatorIdx:1 },
  { title:'How I handle scope creep without damaging client relationships', slug:'handle-scope-creep-gracefully', excerpt:'Scope creep is inevitable. The systems and communication strategies that let me push back firmly without losing clients.', creatorIdx:5 },
  { title:'From freelance to founder: the product journey', slug:'freelance-to-founder-product-journey', excerpt:'After 6 years of freelancing I launched my first product. What changed, what surprised me, and what I would do differently on day one.', creatorIdx:9 },
  { title:'Pricing for value, not time: a practical guide', slug:'pricing-for-value-not-time', excerpt:'Time-based pricing is a ceiling. How I transitioned to project and value pricing — the conversations, the frameworks, and the numbers.', creatorIdx:5 },

  // Tools & workflow
  { title:'Illustration workflows for indie creators', slug:'illustration-workflows-indie-creators', excerpt:"From rough sketches to sellable packs — the exact tools, steps, and mindset shifts that changed my illustration business.", creatorIdx:0 },
  { title:'My full creative stack in 2025', slug:'my-full-creative-stack-2025', excerpt:'The exact tools I use for design, development, writing, and running a solo creator business — with honest notes on what I would cut first.', creatorIdx:2 },
  { title:'Automating client communications without being impersonal', slug:'automating-client-communications', excerpt:'How I use Zapier, Notion, and email sequences to handle 80% of routine communication without every reply feeling like a template.', creatorIdx:5 },
  { title:'Building a second brain that actually works', slug:'building-a-second-brain-that-works', excerpt:'I have tried every PKM system. What actually works for capturing ideas and turning them into useful output — without getting lost in the system itself.', creatorIdx:9 },
  { title:'The development environment I wish I had ten years ago', slug:'development-environment-2025', excerpt:'Warp terminal, Neovim, pnpm, Volta, and a dotfile setup that sets up a new machine in under ten minutes. My current stack.', creatorIdx:1 },
  { title:'How I use Obsidian for technical writing', slug:'obsidian-for-technical-writing', excerpt:'Zettelkasten, linked thinking maps, and a template system that turns every tutorial I write into a network of connected ideas.', creatorIdx:9 },
  { title:'Git workflows for solo creators and small teams', slug:'git-workflows-solo-and-small-teams', excerpt:'Trunk-based development vs feature branches, conventional commits, and the release process I use for both solo projects and client work.', creatorIdx:1 },
  { title:'Why I moved my client work to Linear', slug:'moved-client-work-to-linear', excerpt:'After years of Notion, Trello, and Jira I settled on Linear for managing freelance projects. What made the difference and how I set it up.', creatorIdx:4 },
  { title:'Designing in public: a practical guide', slug:'designing-in-public-practical-guide', excerpt:'Sharing work in progress is uncomfortable. The mindset shifts and practical tactics that made building in public sustainable for me.', creatorIdx:0 },
  { title:'How I ship faster with a personal component library', slug:'personal-component-library', excerpt:'My private npm package of components, hooks, and utilities that I drop into every new project — what is in it and how I maintain it.', creatorIdx:1 },

  // Content & community
  { title:'Writing consistently when you have no time', slug:'writing-consistently-no-time', excerpt:'A system for producing one article per week while working full-time — from capture to draft to publish in four 25-minute sessions.', creatorIdx:5 },
  { title:'How I grew from 0 to 5,000 newsletter subscribers', slug:'grew-to-5000-newsletter-subscribers', excerpt:'The exact tactics, cadence, and content strategy that grew my newsletter over 18 months without ads, viral posts, or a pre-existing audience.', creatorIdx:5 },
  { title:'Creating content that stands out in a saturated niche', slug:'content-that-stands-out', excerpt:'The shift from "more content" to "better framing" — how developing a distinctive perspective changed my content performance entirely.', creatorIdx:9 },
  { title:'Turning a Twitter/X following into paying customers', slug:'twitter-following-to-paying-customers', excerpt:'Audience and customers are different things. The conversion funnel and product strategy that turned a social following into sustainable revenue.', creatorIdx:5 },
  { title:'Building a design portfolio when you are starting out', slug:'design-portfolio-starting-out', excerpt:'No client work? No problem. How to create compelling portfolio pieces that demonstrate skill and attract real projects.', creatorIdx:0 },
  { title:'Creating and selling icon packs: a complete guide', slug:'creating-selling-icon-packs', excerpt:'From style definition to production SVGs, landing page, and first sale — the full process behind my 600+ download icon pack.', creatorIdx:0 },
  { title:'How to get your first 100 design customers', slug:'first-100-design-customers', excerpt:'Outreach, positioning, portfolio, and community — the specific actions that produced the first 100 sales on my digital product.', creatorIdx:3 },
  { title:'The creator burnout cycle and how to break it', slug:'creator-burnout-cycle', excerpt:'Three times I burned out and what the pattern looked like. The system changes that finally broke the cycle without sacrificing output.', creatorIdx:5 },
  { title:'Why most creator businesses fail (and how to avoid it)', slug:'why-creator-businesses-fail', excerpt:'Low prices, no list, dependency on one platform. The structural problems that sink creator businesses — and the safeguards worth building early.', creatorIdx:9 },
  { title:'Community building for indie creators', slug:'community-building-indie-creators', excerpt:'From Discord to paid memberships — what I tried, what worked, and the minimum viable community setup that generates real connection.', creatorIdx:5 },

  // Technical deep-dives
  { title:'Understanding CSS Cascade Layers', slug:'understanding-css-cascade-layers', excerpt:'A practical guide to @layer — what it solves, how to structure your layer stack, and how it interacts with specificity and !important.', creatorIdx:1 },
  { title:'Building accessible modals in React', slug:'building-accessible-modals-react', excerpt:'Focus trapping, ARIA roles, keyboard navigation, and scroll locking — the full implementation guide for dialogs that actually work with screen readers.', creatorIdx:1 },
  { title:'How Supabase RLS actually works', slug:'how-supabase-rls-actually-works', excerpt:'Row Level Security is powerful but confusing. A practical guide with real policy examples for common patterns: public read, owner write, team access.', creatorIdx:4 },
  { title:'Building a design system with CSS custom properties', slug:'design-system-css-custom-properties', excerpt:'Using CSS variables as the foundation of a design system — semantic token architecture, dark mode, and component-level overrides.', creatorIdx:1 },
  { title:'The complete guide to Next.js Image optimisation', slug:'nextjs-image-optimisation-guide', excerpt:'next/image, remote domains, priority loading, blur placeholders, and the CLS issues nobody warns you about. The full picture.', creatorIdx:4 },
  { title:'Taming complex form state with React Hook Form', slug:'taming-complex-form-state-react-hook-form', excerpt:'Multi-step forms, dependent field validation, array fields, and async validation — the patterns that go beyond the basic useForm example.', creatorIdx:1 },
  { title:'Animating with CSS only: what is actually possible in 2025', slug:'animating-with-css-only-2025', excerpt:'scroll-driven animations, @starting-style, view transitions, and interpolate-size — what landed in browsers this year and how to use it now.', creatorIdx:4 },
  { title:'Error boundaries and suspense: a practical guide', slug:'error-boundaries-suspense-practical-guide', excerpt:'Where to draw your error and suspense boundaries, how to test them, and the recovery patterns that make errors recoverable rather than fatal.', creatorIdx:1 },
  { title:'PostgreSQL queries every developer should know', slug:'postgresql-queries-every-developer-should-know', excerpt:'Window functions, CTEs, JSONB, and the explain analyse workflow. The ten query patterns I reach for constantly on production databases.', creatorIdx:9 },
  { title:'Writing readable code: principles over patterns', slug:'writing-readable-code-principles-over-patterns', excerpt:'Naming, function length, abstraction levels, and the three questions I ask myself before committing any function. A philosophy, not a style guide.', creatorIdx:9 },

  // Process & mindset
  { title:'Shipping ugly: why done beats perfect', slug:'shipping-ugly-done-beats-perfect', excerpt:'The perfectionism trap is the single biggest killer of creator projects. A practical reframe and the minimum bar I set before shipping anything.', creatorIdx:2 },
  { title:'How I scope projects to avoid underestimating', slug:'how-i-scope-projects-to-avoid-underestimating', excerpt:'The worksheet, buffer system, and conversation script I use to scope freelance projects — and why I always multiply my first instinct by 1.5.', creatorIdx:5 },
  { title:'The beginner mind: staying curious as a senior', slug:'beginner-mind-staying-curious', excerpt:'Expertise is a trap if it stops you questioning assumptions. How I deliberately maintain a learning posture after ten years in the industry.', creatorIdx:9 },
  { title:'Design feedback that is actually useful', slug:'design-feedback-that-is-actually-useful', excerpt:'Most design feedback is either too vague or too prescriptive. The framework I use to give (and request) feedback that moves projects forward.', creatorIdx:2 },
  { title:'How I use weeknotes to stay accountable', slug:'how-i-use-weeknotes-to-stay-accountable', excerpt:'Public weeknotes are uncomfortable and effective. The format I settled on after a year of publishing, and what changed when I started.', creatorIdx:9 },
  { title:'Setting rates with confidence as a creative', slug:'setting-rates-with-confidence', excerpt:'The research process, comparison framework, and self-talk that helped me stop undercharging and start having rate conversations without anxiety.', creatorIdx:5 },
  { title:'When to say no to a project', slug:'when-to-say-no-to-a-project', excerpt:'The five categories of projects I now decline — and the decision framework that means I almost never have to gut-feel a bad client into a yes.', creatorIdx:5 },
  { title:'Imposter syndrome is feedback, not fact', slug:'imposter-syndrome-is-feedback-not-fact', excerpt:'Two years of daily imposter syndrome and what finally changed. A reframe grounded in what the feeling is actually telling you.', creatorIdx:0 },
  { title:'The power of the 25-minute work block', slug:'power-of-25-minute-work-block', excerpt:'I have tried time blocking, deep work sessions, and GTD. The one system that actually stuck — and why shorter sessions beat longer ones for creative work.', creatorIdx:9 },
  { title:'Delegation as a skill: how I learned to let go', slug:'delegation-as-a-skill', excerpt:'My reluctance to delegate cost me time and growth for three years. The mindset shift, the practical onboarding steps, and what I delegated first.', creatorIdx:5 },

  // Audio/Video
  { title:'Gear guide for creator videos on a budget', slug:'gear-guide-creator-videos-budget', excerpt:'The exact setup I used for my first 50 YouTube videos — a $400 kit that produces results indistinguishable from a $3,000 one if you know the tricks.', creatorIdx:6 },
  { title:'How I edit a 20-minute YouTube video in under two hours', slug:'edit-youtube-video-two-hours', excerpt:'My DaVinci Resolve workflow, proxy setup, keyboard shortcuts, and the rough cut methodology that halved my edit time.', creatorIdx:6 },
  { title:'Podcast distribution: the full 2025 guide', slug:'podcast-distribution-2025', excerpt:'Hosting, RSS, Spotify for Podcasters, Apple Podcasts Connect, YouTube, and the submission checklist that gets your show listed everywhere on day one.', creatorIdx:8 },
  { title:'How to record clear audio anywhere', slug:'how-to-record-clear-audio-anywhere', excerpt:'Mic technique, room treatment on a budget, the three free plugins that fix most audio problems, and how to record a clean track in a reverb-heavy room.', creatorIdx:8 },
  { title:'Growing a YouTube channel without going viral', slug:'growing-youtube-channel-without-going-viral', excerpt:'Slow, consistent growth beats chasing the algorithm. The SEO, thumbnail, and retention optimisation that compounds over 12–18 months.', creatorIdx:6 },
  { title:'Audio branding for creators', slug:'audio-branding-for-creators', excerpt:'Your intro music, notification sounds, and overall audio aesthetic are part of your brand. How to develop an audio identity that reinforces your visual brand.', creatorIdx:8 },
  { title:'Motion graphics with After Effects: beginner to shipped', slug:'motion-graphics-after-effects', excerpt:'The specific AE skills worth learning first, the workflow for logo animations and lower-thirds, and the export settings that actually work everywhere.', creatorIdx:6 },
  { title:'The remote recording setup I use for client video projects', slug:'remote-recording-client-video', excerpt:'Riverside, Descript, and Cleanfeed — the stack I use to record, transcribe, and edit remote client interviews without any quality compromise.', creatorIdx:6 },

  // Strategy
  { title:'Building something people will pay for', slug:'building-something-people-will-pay-for', excerpt:'Idea validation without surveys or landing page MVPs. The conversations, observations, and small bets that tell you if a product is worth building.', creatorIdx:9 },
  { title:'Distribution is the product', slug:'distribution-is-the-product', excerpt:'Most products fail because of distribution, not quality. The channels, positioning, and launch mechanics I use to get in front of the right people.', creatorIdx:9 },
  { title:'How to do customer discovery without annoying people', slug:'customer-discovery-without-annoying-people', excerpt:'The interview format, question types, and follow-up cadence that get real information from potential customers — without turning them off.', creatorIdx:2 },
  { title:'Positioning your creative work to attract better clients', slug:'positioning-creative-work', excerpt:'Positioning is the difference between "I do websites" and "I help SaaS startups reduce churn through better onboarding design." How to make the shift.', creatorIdx:5 },
  { title:'Product analytics for solo creators', slug:'product-analytics-solo-creators', excerpt:'You do not need Amplitude or Mixpanel to make data-informed decisions. The minimal analytics setup that answers the questions that actually matter.', creatorIdx:9 },
  { title:'How I validate new product ideas in 48 hours', slug:'validate-product-ideas-48-hours', excerpt:'A repeatable process for stress-testing new ideas fast — a landing page test, three customer conversations, and a go/no-go decision framework.', creatorIdx:9 },
  { title:'Evergreen content vs trending content: the right mix', slug:'evergreen-vs-trending-content', excerpt:'Trending content spikes but fades. Evergreen content compounds. The content strategy that uses both and lets the algorithm work for you over time.', creatorIdx:5 },
]

export const mockArticles: Article[] = DEFS.map((d, i) => ({
  id: `a${i + 1}`,
  creator_id: CREATORS[d.creatorIdx].id,
  title: d.title,
  slug: d.slug,
  excerpt: d.excerpt,
  content: '',
  cover_url: IMAGES[i % IMAGES.length],
  published: true,
  published_at: daysAgo(i + 1),
  created_at: daysAgo(i + 2),
  creator: CREATORS[d.creatorIdx],
}))

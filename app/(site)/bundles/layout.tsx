import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bundles — Curated Digital Products for Creators',
  description: 'Browse curated digital bundles — UI kits, code templates, icon sets, eBooks and Notion templates. Everything you need to build, design and ship faster.',
  openGraph: {
    title: 'Bundles — Curated Digital Products for Creators | Montnexus',
    description: 'Browse curated digital bundles — UI kits, code templates, icon sets, eBooks and Notion templates. Everything you need to build, design and ship faster.',
    url: 'https://montnexus.com/bundles',
  },
}

export default function BundlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

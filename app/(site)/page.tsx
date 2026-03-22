export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ProductGrid } from '@/components/sections/ProductGrid'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Newsletter } from '@/components/sections/Newsletter'
import { ServiceGrid } from '@/components/sections/ServiceGrid'
import { ShowcaseFeed } from '@/components/sections/ShowcaseFeed'
import { ServicesHero } from '@/components/sections/ServicesHero'
import { ArticlesFeed } from '@/components/sections/ArticlesFeed'
import { mockProducts } from '@/lib/mock-products'
import { mockServices } from '@/lib/mock-services'
import { mockShowcase } from '@/lib/mock-showcase'
import { mockArticles } from '@/lib/mock-articles'
import { createClient } from '@/lib/supabase/server'
import type { Product, Service, ShowcasePost, Article } from '@/types'

async function getHomeData() {
  try {
    const supabase = await createClient()
    const [productsRes, servicesRes, showcaseRes, articlesRes] = await Promise.all([
      supabase
        .from('products')
        .select('*, creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('services')
        .select('*, tiers:service_tiers(*), creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('showcase_posts')
        .select('*, media:showcase_media(*), creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('articles')
        .select('*, creator:creators(id, username, display_name, avatar_url)')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(4),
    ])

    const products = (productsRes.data && productsRes.data.length > 0)
      ? (productsRes.data as Product[])
      : mockProducts.filter(p => p.published)

    const services = (servicesRes.data && servicesRes.data.length > 0)
      ? (servicesRes.data as Service[])
      : mockServices.filter(s => s.published)

    const showcase = (showcaseRes.data && showcaseRes.data.length > 0)
      ? (showcaseRes.data as ShowcasePost[])
      : mockShowcase

    const articles = (articlesRes.data && articlesRes.data.length > 0)
      ? (articlesRes.data as Article[])
      : mockArticles

    return { products, services, showcase, articles }
  } catch {
    return {
      products: mockProducts.filter(p => p.published),
      services: mockServices.filter(s => s.published),
      showcase: mockShowcase,
      articles: mockArticles,
    }
  }
}

export default async function HomePage() {
  const { products, services, showcase, articles } = await getHomeData()
  const featured = products.filter(p => p.published).slice(0, 3)
  const free = products.filter(p => p.is_free && p.published)
  const featuredServices = services.slice(0, 3)
  const recentShowcase = showcase.slice(0, 6)

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <ProductGrid products={featured} label="Featured bundles" title="Popular this month" viewAllHref="/bundles" />
        <ServicesHero />
        <ServiceGrid services={featuredServices} label="Hire a creator" title="Featured services" viewAllHref="/services" />
        <ProductGrid products={free} label="Free downloads" title="Grab for free" viewAllHref="/bundles?free=true" />
        <ShowcaseFeed posts={recentShowcase} label="Community" title="Fresh work from creators" viewAllHref="/showcase" />
        <ArticlesFeed articles={articles.slice(0, 6)} />
        <CtaBanner />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createServiceClient()

  const { data: creator, error } = await supabase
    .from('creators')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !creator) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: products } = await supabase
    .from('products')
    .select('id, title, slug, short_desc, cover_url, price_cents, is_free, category')
    .eq('creator_id', creator.id)
    .eq('published', true)

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_url, published_at')
    .eq('creator_id', creator.id)
    .eq('published', true)

  return NextResponse.json({ ...creator, products: products ?? [], articles: articles ?? [] })
}

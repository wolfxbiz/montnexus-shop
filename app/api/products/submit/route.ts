import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', userId)
    .single()
  if (!creator) return NextResponse.json({ error: 'Creator profile required' }, { status: 403 })

  const body = await req.json()
  const { title, slug, description, short_desc, category, price_cents, cover_url, file_count } = body

  const { data, error } = await supabase
    .from('products')
    .insert({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description,
      short_desc,
      category,
      price_cents: price_cents ?? 0,
      cover_url,
      file_count: file_count ?? 1,
      creator_id: creator.id,
      published: false, // pending review
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

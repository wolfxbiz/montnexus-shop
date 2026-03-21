import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createServiceClient()
  const { searchParams } = new URL(req.url)
  const creatorId = searchParams.get('creator_id')

  let query = supabase
    .from('articles')
    .select('*, creator:creators(username, display_name, avatar_url)')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (creatorId) query = query.eq('creator_id', creatorId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

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
  const { title, slug, excerpt, content, cover_url, published } = body

  const { data, error } = await supabase
    .from('articles')
    .insert({
      creator_id: creator.id,
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      excerpt,
      content,
      cover_url,
      published: published ?? false,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

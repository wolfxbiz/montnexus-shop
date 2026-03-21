import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*, creator:creators(id, username, display_name, avatar_url, bio, twitter, website)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServiceClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data: article } = await supabase
    .from('articles')
    .select('id, creator_id, creators(user_id)')
    .eq('slug', slug)
    .single()

  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const creatorUserId = (article.creators as unknown as { user_id: string })?.user_id
  if (creatorUserId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('articles')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', article.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

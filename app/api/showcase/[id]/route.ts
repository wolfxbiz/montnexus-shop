import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: post, error } = await supabase
    .from('showcase_posts')
    .select('*, media:showcase_media(*), creator:creators(id, username, display_name, avatar_url)')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Like count
  const { count } = await supabase
    .from('showcase_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)

  post.like_count = count || 0

  // Check if current user liked
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (userId) {
    const { data: myLike } = await supabase
      .from('showcase_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .maybeSingle()
    post.liked_by_user = !!myLike
  } else {
    post.liked_by_user = false
  }

  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: post } = await supabase
    .from('showcase_posts')
    .select('id, creator_id, creators(user_id)')
    .eq('id', id)
    .single()

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const creatorUserId = (post.creators as unknown as { user_id: string })?.user_id
  if (creatorUserId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('showcase_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

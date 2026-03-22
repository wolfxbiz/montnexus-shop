import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params
  const supabase = await createServiceClient()

  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if already liked
  const { data: existing } = await supabase
    .from('showcase_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    // Unlike
    await supabase.from('showcase_likes').delete().eq('id', existing.id)
  } else {
    // Like
    const { error } = await supabase
      .from('showcase_likes')
      .insert({ post_id: postId, user_id: userId })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return new count
  const { count } = await supabase
    .from('showcase_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  return NextResponse.json({ liked: !existing, like_count: count || 0 })
}

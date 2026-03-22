import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createServiceClient()
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  const creatorId = searchParams.get('creator_id')
  const limit = parseInt(searchParams.get('limit') || '30', 10)
  const cursor = searchParams.get('cursor') // created_at of last post

  let query = supabase
    .from('showcase_posts')
    .select('*, media:showcase_media(*), creator:creators(id, username, display_name, avatar_url)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (tag) query = query.contains('tags', [tag])
  if (creatorId) query = query.eq('creator_id', creatorId)
  if (cursor) query = query.lt('created_at', cursor)

  const { data: posts, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get like counts
  if (posts && posts.length > 0) {
    const postIds = posts.map(p => p.id)
    const { data: likeCounts } = await supabase
      .from('showcase_likes')
      .select('post_id')
      .in('post_id', postIds)

    const countMap: Record<string, number> = {}
    likeCounts?.forEach(l => {
      countMap[l.post_id] = (countMap[l.post_id] || 0) + 1
    })

    // Check if current user has liked
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
    let userLikes: Set<string> = new Set()
    if (userId) {
      const { data: myLikes } = await supabase
        .from('showcase_likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds)
      myLikes?.forEach(l => userLikes.add(l.post_id))
    }

    posts.forEach(p => {
      p.like_count = countMap[p.id] || 0
      p.liked_by_user = userLikes.has(p.id)
    })
  }

  return NextResponse.json(posts)
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
  const { caption, tags, published } = body

  const { data: post, error } = await supabase
    .from('showcase_posts')
    .insert({
      creator_id: creator.id,
      caption: caption || '',
      tags: tags || [],
      published: published ?? true,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(post)
}

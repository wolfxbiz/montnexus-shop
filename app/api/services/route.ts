import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createServiceClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const creatorId = searchParams.get('creator_id')

  let query = supabase
    .from('services')
    .select('*, tiers:service_tiers(*), creator:creators(id, username, display_name, avatar_url)')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
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
  const { title, slug, description, short_desc, category, cover_url, delivery_time_days, tiers } = body

  const serviceSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  // Insert service
  const { data: service, error: serviceErr } = await supabase
    .from('services')
    .insert({
      creator_id: creator.id,
      title,
      slug: serviceSlug,
      description,
      short_desc,
      category,
      cover_url,
      delivery_time_days: delivery_time_days || 7,
      published: false,
    })
    .select('id')
    .single()

  if (serviceErr) return NextResponse.json({ error: serviceErr.message }, { status: 500 })

  // Insert tiers if provided
  if (tiers && Array.isArray(tiers) && tiers.length > 0) {
    const tierRows = tiers.map((t: { name: string; title: string; description: string; price_cents: number; delivery_time_days: number; revisions: number; features: string[] }) => ({
      service_id: service.id,
      name: t.name,
      title: t.title,
      description: t.description,
      price_cents: t.price_cents,
      delivery_time_days: t.delivery_time_days,
      revisions: t.revisions,
      features: t.features,
    }))

    const { error: tierErr } = await supabase.from('service_tiers').insert(tierRows)
    if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 500 })
  }

  return NextResponse.json({ id: service.id, slug: serviceSlug })
}

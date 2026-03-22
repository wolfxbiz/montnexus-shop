import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServiceClient()

  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { tier_id, brief } = body
  if (!tier_id) return NextResponse.json({ error: 'tier_id required' }, { status: 400 })

  // Get service
  const { data: service } = await supabase
    .from('services')
    .select('id, creator_id')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

  // Get tier
  const { data: tier } = await supabase
    .from('service_tiers')
    .select('id, price_cents, delivery_time_days')
    .eq('id', tier_id)
    .eq('service_id', service.id)
    .single()

  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })

  // Prevent creators from ordering their own service
  const { data: creator } = await supabase
    .from('creators')
    .select('user_id')
    .eq('id', service.creator_id)
    .single()

  if (creator?.user_id === userId) {
    return NextResponse.json({ error: 'Cannot order your own service' }, { status: 400 })
  }

  // Create order
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + tier.delivery_time_days)

  const { data: order, error } = await supabase
    .from('service_orders')
    .insert({
      service_id: service.id,
      tier_id: tier.id,
      client_id: userId,
      creator_id: service.creator_id,
      status: 'inquiry',
      brief: brief || '',
      amount_cents: tier.price_cents,
      due_date: dueDate.toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(order)
}

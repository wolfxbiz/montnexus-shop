import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

    const { data: product } = await supabase
      .from('products')
      .select('id, is_free')
      .eq('id', productId)
      .eq('is_free', true)
      .single()

    if (!product) return NextResponse.json({ error: 'Free product not found' }, { status: 404 })

    // Upsert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, product_id: productId, amount_cents: 0, status: 'free' })
      .select()
      .single()

    if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const { error: dlError } = await supabase
      .from('downloads')
      .insert({ order_id: order.id, user_id: userId, product_id: productId, token, expires_at: expiresAt })

    if (dlError) return NextResponse.json({ error: dlError.message }, { status: 500 })

    return NextResponse.json({ token, downloadUrl: `/api/download/${token}` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

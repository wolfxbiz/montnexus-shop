import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceClient()

    // Get auth from cookie-based session
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

    const { data: product, error } = await supabase
      .from('products')
      .select('id, title, price_cents, slug')
      .eq('id', productId)
      .eq('published', true)
      .single()

    if (error || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    if (product.price_cents === 0) return NextResponse.json({ error: 'Use /api/checkout/free for free products' }, { status: 400 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: product.title },
          unit_amount: product.price_cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/bundles/${product.slug}`,
      metadata: { productId: product.id, userId },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

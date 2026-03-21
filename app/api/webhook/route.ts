import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { PurchaseEmail } from '@/lib/resend/templates/PurchaseEmail'
import { randomBytes } from 'crypto'
import React from 'react'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as unknown as { metadata: { productId: string; userId: string }; id: string; payment_intent: string; customer_email: string | null; amount_total: number | null }

    const { productId, userId } = session.metadata || {}
    if (!productId || !userId) return NextResponse.json({ received: true })

    const supabase = await createServiceClient()

    const { data: product } = await supabase
      .from('products')
      .select('id, title, price_cents')
      .eq('id', productId)
      .single()

    if (!product) return NextResponse.json({ received: true })

    const { data: order } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        product_id: productId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        amount_cents: session.amount_total ?? product.price_cents,
        status: 'paid',
      })
      .select()
      .single()

    if (!order) return NextResponse.json({ received: true })

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    await supabase.from('downloads').insert({
      order_id: order.id,
      user_id: userId,
      product_id: productId,
      token,
      expires_at: expiresAt,
    })

    // Send receipt email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const downloadUrl = `${siteUrl}/api/download/${token}`
    const userEmail = session.customer_email

    if (userEmail) {
      await resend.emails.send({
        from: 'Montnexus <hello@montnexus.shop>',
        to: userEmail,
        subject: `Your download: ${product.title}`,
        react: React.createElement(PurchaseEmail, {
          productTitle: product.title,
          downloadUrl,
          amountCents: product.price_cents,
        }),
      })
    }
  }

  return NextResponse.json({ received: true })
}

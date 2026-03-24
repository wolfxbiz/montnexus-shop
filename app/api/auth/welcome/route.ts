import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/lib/resend/templates/WelcomeEmail'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Montnexus <hello@montnexus.shop>',
      to: email,
      subject: `Welcome to Montnexus${name ? `, ${name}` : ''}`,
      react: WelcomeEmail({ name: name || null }),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

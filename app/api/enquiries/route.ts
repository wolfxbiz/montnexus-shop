import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['vivekshajilekha@gmail.com']

// POST — public, no auth required (anyone can submit the form)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service, budget, description } = body

    if (!name?.trim() || !email?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServiceClient()
    const { error } = await supabase.from('project_enquiries').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      service: service || null,
      budget: budget || null,
      description: description.trim(),
      status: 'new',
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enquiry insert error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

// GET — admin only
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServiceClient()
    const { data: { user } } = await supabase.auth.getUser(auth)
    if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('project_enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Enquiry fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PATCH — update status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServiceClient()
    const { data: { user } } = await supabase.auth.getUser(auth)
    if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, status } = await req.json()
    const { error } = await supabase
      .from('project_enquiries')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enquiry update error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

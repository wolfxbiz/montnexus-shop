import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['vivekshajilekha@gmail.com']

async function getAdminUser(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const supabase = await createServiceClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) return null
  return user
}

export async function GET(req: NextRequest) {
  const user = await getAdminUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServiceClient()

  const { data: users, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, id, status, amount_cents, created_at, products(title, slug)')
    .order('created_at', { ascending: false })

  const ordersByUser: Record<string, typeof orders> = {}
  for (const order of orders ?? []) {
    if (!ordersByUser[order.user_id]) ordersByUser[order.user_id] = []
    ordersByUser[order.user_id]!.push(order)
  }

  const result = users.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    orders: ordersByUser[u.id] ?? [],
  }))

  return NextResponse.json(result)
}

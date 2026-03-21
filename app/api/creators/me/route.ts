import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id
  if (!userId) return NextResponse.json(null, { status: 401 })

  const { data } = await supabase
    .from('creators')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!data) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(data)
}

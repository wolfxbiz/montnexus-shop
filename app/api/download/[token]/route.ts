import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  try {
    const supabase = await createServiceClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: download } = await supabase
      .from('downloads')
      .select('*, orders(status), products(file_path)')
      .eq('token', token)
      .eq('user_id', userId)
      .single()

    if (!download) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

    const orderStatus = (download.orders as { status: string })?.status
    if (!['paid', 'free'].includes(orderStatus)) {
      return NextResponse.json({ error: 'Order not paid' }, { status: 403 })
    }

    const filePath = (download.products as { file_path: string })?.file_path
    if (!filePath) return NextResponse.json({ error: 'File not found' }, { status: 404 })

    // Refresh expiry and increment count
    await supabase.from('downloads').update({
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      download_count: download.download_count + 1,
    }).eq('id', download.id)

    const { data: signedData, error: signError } = await supabase
      .storage
      .from('Products')
      .createSignedUrl(filePath, 15 * 60)

    if (signError || !signedData) {
      return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
    }

    return NextResponse.redirect(signedData.signedUrl)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

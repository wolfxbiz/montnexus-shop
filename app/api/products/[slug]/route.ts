import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-products'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = mockProducts.find(p => p.slug === slug && p.published)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-products'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const freeOnly = searchParams.get('free') === 'true'

  let products = mockProducts.filter(p => p.published)
  if (category) products = products.filter(p => p.category === category)
  if (freeOnly) products = products.filter(p => p.is_free)

  return NextResponse.json(products)
}

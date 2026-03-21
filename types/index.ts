export type ProductCategory = 'design' | 'dev' | 'ebook' | 'template' | 'icon'
export type OrderStatus = 'pending' | 'paid' | 'free' | 'refunded'

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  short_desc: string
  category: ProductCategory
  price_cents: number
  is_free: boolean
  file_path?: string  // server-only, never send to client
  cover_url: string
  file_count: number
  published: boolean
  created_at: string
}

export interface ProductPublic extends Omit<Product, 'file_path'> {}

export interface Order {
  id: string
  user_id: string
  product_id: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  amount_cents: number
  status: OrderStatus
  created_at: string
}

export interface Download {
  id: string
  order_id: string
  user_id: string
  product_id: string
  token: string
  expires_at: string
  download_count: number
  created_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  newsletter: boolean
  updated_at: string
}

export interface Creator {
  id: string
  user_id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  website: string | null
  twitter: string | null
  total_products: number
  total_sales: number
  created_at: string
}

export interface Article {
  id: string
  creator_id: string
  title: string
  slug: string
  excerpt: string
  content: string  // markdown
  cover_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
  creator?: Creator
}

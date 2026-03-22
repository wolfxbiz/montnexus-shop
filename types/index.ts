export type ProductCategory = 'design' | 'dev' | 'ebook' | 'template' | 'icon'
export type OrderStatus = 'pending' | 'paid' | 'free' | 'refunded'

// ─── Services ───
export type ServiceCategory = 'design' | 'dev' | 'consulting' | 'writing' | 'audio-video'
export type ServiceTierName = 'basic' | 'standard' | 'premium'
export type ServiceOrderStatus = 'inquiry' | 'accepted' | 'in_progress' | 'delivered' | 'revision' | 'completed' | 'cancelled'

export interface ServiceTier {
  id: string
  service_id: string
  name: ServiceTierName
  title: string
  description: string
  price_cents: number
  delivery_time_days: number
  revisions: number
  features: string[]
}

export interface Service {
  id: string
  creator_id: string
  title: string
  slug: string
  description: string
  short_desc: string
  category: ServiceCategory
  cover_url: string
  delivery_time_days: number
  published: boolean
  created_at: string
  tiers?: ServiceTier[]
  creator?: Creator
}

export interface ServiceOrder {
  id: string
  service_id: string
  tier_id: string
  client_id: string
  creator_id: string
  status: ServiceOrderStatus
  brief: string
  amount_cents: number
  due_date: string | null
  created_at: string
  service?: Service
  tier?: ServiceTier
}

// ─── Showcase ───
export interface ShowcasePost {
  id: string
  creator_id: string
  caption: string
  tags: string[]
  published: boolean
  created_at: string
  media?: ShowcaseMedia[]
  creator?: Creator
  like_count?: number
  liked_by_user?: boolean
}

export interface ShowcaseMedia {
  id: string
  post_id: string
  media_url: string
  media_type: 'image' | 'video'
  width: number
  height: number
  sort_order: number
}

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

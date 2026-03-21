create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  stripe_session_id text,
  stripe_payment_intent text,
  amount_cents integer not null default 0,
  status text not null default 'pending' check (status in ('pending','paid','free','refunded')),
  created_at timestamptz not null default now()
);

create index on orders (user_id);
create index on orders (product_id);
create index on orders (stripe_session_id);

create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  token text unique not null,
  expires_at timestamptz not null default now() + interval '15 minutes',
  download_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index on downloads (token);
create index on downloads (user_id);

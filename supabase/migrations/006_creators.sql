create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  website text,
  twitter text,
  total_products integer not null default 0,
  total_sales integer not null default 0,
  created_at timestamptz not null default now()
);
create index on creators (username);
alter table creators enable row level security;
create policy "Public can read creators" on creators for select using (true);
create policy "Creators can update own profile" on creators for update using (auth.uid() = user_id);
create policy "Users can create creator profile" on creators for insert with check (auth.uid() = user_id);

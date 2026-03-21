-- Products: public read for published, no writes via RLS
alter table products enable row level security;
create policy "Public can read published products"
  on products for select using (published = true);

-- Orders: users can only see their own
alter table orders enable row level security;
create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);
create policy "Users can create own orders"
  on orders for insert with check (auth.uid() = user_id);

-- Downloads: users can only see their own
alter table downloads enable row level security;
create policy "Users can view own downloads"
  on downloads for select using (auth.uid() = user_id);

-- Profiles: users can read and update own profile
alter table profiles enable row level security;
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

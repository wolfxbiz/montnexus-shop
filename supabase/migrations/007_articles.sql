create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on articles (slug);
create index on articles (creator_id);
create index on articles (published);
alter table articles enable row level security;
create policy "Public can read published articles" on articles for select using (published = true);
create policy "Creators can manage own articles" on articles for all using (
  auth.uid() = (select user_id from creators where id = articles.creator_id)
);

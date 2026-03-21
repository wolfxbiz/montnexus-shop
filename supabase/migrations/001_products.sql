create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  short_desc text,
  category text not null check (category in ('design','dev','ebook','template','icon')),
  price_cents integer not null default 0,
  is_free boolean generated always as (price_cents = 0) stored,
  file_path text,
  cover_url text,
  file_count integer not null default 1,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index on products (category);
create index on products (is_free);
create index on products (published);

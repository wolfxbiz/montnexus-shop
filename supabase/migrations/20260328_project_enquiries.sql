-- Project enquiries submitted from /work-with-us
create table if not exists project_enquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  service       text,
  budget        text,
  description   text not null,
  status        text not null default 'new',   -- new | contacted | closed
  created_at    timestamptz not null default now()
);

-- Index for admin queries (newest first)
create index if not exists project_enquiries_created_at_idx
  on project_enquiries (created_at desc);

-- Anyone can insert (public form), only service role can read
alter table project_enquiries enable row level security;

create policy "Public can insert enquiries"
  on project_enquiries for insert
  with check (true);

create policy "Service role can read enquiries"
  on project_enquiries for select
  using (auth.role() = 'service_role');

create policy "Service role can update enquiries"
  on project_enquiries for update
  using (auth.role() = 'service_role');

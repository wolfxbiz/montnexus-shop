alter table products add column if not exists creator_id uuid references creators(id) on delete cascade;
create index if not exists products_creator_id_idx on products (creator_id);

create policy "Creators can insert own products" on products
  for insert with check (
    auth.uid() = (select user_id from creators where id = products.creator_id)
  );

create policy "Admins can update products" on products
  for update using (true);

create policy "Admins can delete products" on products
  for delete using (true);

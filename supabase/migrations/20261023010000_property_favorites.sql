create table public.property_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

alter table public.property_favorites enable row level security;

revoke all on public.property_favorites from anon, authenticated;
grant select, insert, delete on public.property_favorites to authenticated;

create policy "Users can read their own property favorites" on public.property_favorites
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can favorite published properties" on public.property_favorites
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.properties
      where id = property_id and status = 'published'
    )
  );

create policy "Users can remove their own property favorites" on public.property_favorites
  for delete to authenticated
  using (user_id = (select auth.uid()));

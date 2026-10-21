create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where id = (select auth.uid())
  );
$$;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  operation text not null check (operation in ('venta', 'alquiler')),
  property_type text not null check (property_type in ('Departamento', 'Casa', 'PH')),
  neighborhood text not null,
  city text not null,
  price numeric not null check (price >= 0),
  currency text not null check (currency in ('USD', 'ARS')),
  rooms integer not null default 0 check (rooms >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  area integer not null default 0 check (area >= 0),
  covered_area integer not null default 0 check (covered_area >= 0),
  description text not null default '',
  images text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on function public.is_admin() from public;
grant select on public.admin_users to authenticated;
grant select on public.properties to anon, authenticated;
grant insert, update, delete on public.properties to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

create policy "Admins can read their own access" on public.admin_users
  for select to authenticated using (id = (select auth.uid()));

create policy "Published listings are public; admins can read all" on public.properties
  for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

create policy "Admins can create listings" on public.properties
  for insert to authenticated with check ((select public.is_admin()));

create policy "Admins can update listings" on public.properties
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins can delete listings" on public.properties
  for delete to authenticated using ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can upload listing images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'property-images' and (select public.is_admin())
  );

create policy "Admins can update listing images" on storage.objects
  for update to authenticated
  using (bucket_id = 'property-images' and (select public.is_admin()))
  with check (bucket_id = 'property-images' and (select public.is_admin()));

create policy "Admins can delete listing images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'property-images' and (select public.is_admin())
  );

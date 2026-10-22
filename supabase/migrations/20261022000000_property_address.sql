alter table public.properties
  add column if not exists street text not null default '',
  add column if not exists street_number text not null default '';

create table if not exists public.property_private_addresses (
  property_id uuid primary key references public.properties (id) on delete cascade,
  floor text,
  apartment text
);

alter table public.property_private_addresses enable row level security;

revoke all on public.property_private_addresses from public, anon, authenticated;
grant select, insert, update, delete on public.property_private_addresses to authenticated;

create policy "Admins can read private property addresses" on public.property_private_addresses
  for select to authenticated using ((select public.is_admin()));

create policy "Admins can create private property addresses" on public.property_private_addresses
  for insert to authenticated with check ((select public.is_admin()));

create policy "Admins can update private property addresses" on public.property_private_addresses
  for update to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete private property addresses" on public.property_private_addresses
  for delete to authenticated using ((select public.is_admin()));

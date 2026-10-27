alter table public.properties
  add column floor_plans text[] not null default '{}';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-plans', 'property-plans', true, 20971520, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can upload property plans" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'property-plans' and (select public.is_admin())
  );

create policy "Admins can update property plans" on storage.objects
  for update to authenticated
  using (bucket_id = 'property-plans' and (select public.is_admin()))
  with check (bucket_id = 'property-plans' and (select public.is_admin()));

create policy "Admins can delete property plans" on storage.objects
  for delete to authenticated using (
    bucket_id = 'property-plans' and (select public.is_admin())
  );

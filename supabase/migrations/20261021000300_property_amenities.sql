alter table public.properties
  add column if not exists amenities text[] not null default '{}';

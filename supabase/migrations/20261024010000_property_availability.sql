alter table public.properties
  add column availability_status text not null default 'available'
  check (availability_status in ('available', 'reserved', 'sold', 'rented'));

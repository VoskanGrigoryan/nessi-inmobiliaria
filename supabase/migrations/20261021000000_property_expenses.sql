alter table public.properties
add column if not exists expenses numeric check (expenses >= 0);

alter table public.properties
  drop constraint if exists properties_property_type_check;

alter table public.properties
  add constraint properties_property_type_check
    check (property_type in ('Departamento', 'Casa', 'PH', 'Otro', 'Lote', 'Depósito', 'Local comercial', 'Cochera', 'Oficina'));

alter table public.properties
  drop constraint if exists properties_disposition_check;

alter table public.properties
  add constraint properties_disposition_check
    check (disposition in ('Frente', 'Contrafrente', 'Lateral', 'Interno'));

alter table public.properties rename column amenities to characteristics;

alter table public.properties
  add column uncovered_area integer not null default 0 check (uncovered_area >= 0),
  add column semi_covered_area integer not null default 0 check (semi_covered_area >= 0),
  add column accessible_ramp boolean not null default false,
  add column building_age text check (building_age in ('En pozo', 'A estrenar', '1 a 10', '10 a 20', '20+')),
  add column apto_credito boolean not null default false,
  add column video_url text,
  add column garage_count integer not null default 0;

update public.properties
set garage_count = case when has_garage then 1 else 0 end;

alter table public.properties
  drop column has_garage,
  add constraint properties_garage_count_check check (garage_count >= 0);

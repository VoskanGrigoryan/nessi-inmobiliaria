alter table public.properties
  drop constraint if exists properties_property_type_check;

alter table public.properties
  add constraint properties_property_type_check
    check (property_type in ('Departamento', 'Casa', 'PH', 'Otro')),
  add column if not exists has_garage boolean not null default false;

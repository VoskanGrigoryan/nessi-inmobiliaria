alter table public.properties
  drop constraint if exists properties_operation_check;

alter table public.properties
  add constraint properties_operation_check
    check (operation in ('venta', 'alquiler', 'alquiler_temporal'));

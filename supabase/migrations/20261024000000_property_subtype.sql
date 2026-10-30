alter table public.properties
  add column property_subtype text
    check (property_subtype is null or property_subtype in (
      'Aparestudio',
      'Dúplex',
      'Estándar',
      'Loft',
      'Monoambiente',
      'Penthouse',
      'Piso',
      'Semipiso',
      'Tríplex'
    ));

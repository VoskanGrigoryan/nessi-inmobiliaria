alter table public.properties
  add column if not exists orientation text check (orientation in ('Norte', 'Noreste', 'Este', 'Sudeste', 'Sur', 'Sudoeste', 'Oeste', 'Noroeste')),
  add column if not exists disposition text check (disposition in ('Frente', 'Contrafrente'));

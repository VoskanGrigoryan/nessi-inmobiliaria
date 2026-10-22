# Nessi Inmobiliaria

Sitio público y panel privado para administrar propiedades con Next.js, Supabase y Tailwind CSS.

## Desarrollo local

```bash
npm install
npm run dev
```

Sin variables de Supabase, el sitio muestra avisos de muestra en desarrollo y el panel indica que falta la configuración.

## Conectar Supabase

1. Creá un proyecto en Supabase y copiá `.env.example` como `.env.local`.
2. Completá la URL del proyecto y su publishable key.
3. Ejecutá en orden `supabase/migrations/20261020000000_properties.sql`, `supabase/migrations/20261021000000_property_expenses.sql` y `supabase/migrations/20261021000100_property_orientation_disposition.sql`, `supabase/migrations/20261021000200_property_type_garage.sql` y `supabase/migrations/20261021000300_property_amenities.sql` desde el SQL Editor.
4. Invitá a cada administrador desde **Authentication → Users**.
5. Agregá el UUID del usuario invitado a `public.admin_users`:

```sql
insert into public.admin_users (id)
values ('UUID_DEL_USUARIO');
```

El alta pública de usuarios debe permanecer desactivada. Los administradores ingresan en `/admin/login`; desde ahí pueden crear, editar, publicar, guardar borradores y eliminar avisos. Las fotos aceptadas son JPG, PNG y WebP de hasta 8 MB.

Configurá las mismas variables de entorno en el proveedor de hosting antes de desplegar. El catálogo de producción no usa los avisos de muestra.

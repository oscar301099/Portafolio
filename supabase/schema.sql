-- ============================================
-- Tabla de circulares de la Aduana Nacional
-- Ejecutar UNA VEZ en: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================

create table if not exists public.circulares (
  id         bigint generated always as identity primary key,
  nro        integer not null,
  circular   text not null,
  fecha      text not null,
  tipo       text not null,
  resumen    text not null,
  enlace     text not null,
  created_at timestamptz not null default now()
);

-- Detección de duplicados: la combinación (circular, fecha) debe ser única.
-- El scraper omite cualquier registro que la viole (código 23505 de Postgres).
alter table public.circulares
  add constraint circulares_circular_fecha_key unique (circular, fecha);

-- Seguridad: con RLS activado y SIN políticas, la API pública de Supabase
-- (claves anon/publishable) no puede leer ni escribir esta tabla.
-- La app usa la service_role key desde el servidor, que ignora RLS, así que
-- sigue funcionando igual.
-- Si la tabla ya existe, basta con ejecutar solo esta línea:
alter table public.circulares enable row level security;

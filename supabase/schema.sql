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

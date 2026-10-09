/**
 * Entidad de dominio: una circular de la Aduana Nacional.
 * No depende de base de datos, HTTP ni de ninguna librería externa.
 */
export type Circular = {
  nro: number;
  circular: string;
  fecha: string;
  tipo: string;
  resumen: string;
  enlace: string;
};

/** Circular persistida: la entidad más su identidad y metadatos de almacenamiento. */
export type StoredCircular = Circular & {
  id: number;
  createdAt: string;
};

/**
 * Orden del listado oficial: de la circular más nueva a la más antigua
 * (año desc, número desc; ej. 253/2026 antes que 252/2026 y que 300/2025).
 *
 * No se usa `nro` porque es la posición que tenía la circular en el sitio el
 * día que se scrapeó y cambia cada vez que se publica una nueva. Tampoco el
 * orden de inserción, que depende de cuándo se ejecutó cada scraping.
 */
export function compareCircularesDesc(a: Circular, b: Circular): number {
  const ka = sortKey(a);
  const kb = sortKey(b);
  return kb.year - ka.year || kb.number - ka.number || kb.date - ka.date;
}

function sortKey(item: Circular): { year: number; number: number; date: number } {
  // "253/2026" → número 253, año 2026
  const circular = item.circular.match(/(\d+)\s*\/\s*(\d{4})/);
  // "02/10/2026" → 20261002 (desempate y respaldo si la circular no tiene ese formato)
  const fecha = item.fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const date = fecha ? Number(fecha[3] + fecha[2] + fecha[1]) : 0;

  return {
    year: circular ? Number(circular[2]) : Math.floor(date / 10000),
    number: circular ? Number(circular[1]) : 0,
    date,
  };
}

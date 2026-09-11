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

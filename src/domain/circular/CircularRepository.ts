import type { Circular, StoredCircular } from "./Circular";

/**
 * Puerto de persistencia (contrato del dominio). La infraestructura lo implementa.
 * La regla de unicidad vive en el dominio: una circular se identifica por
 * la combinación (circular, fecha).
 */
export interface CircularRepository {
  /**
   * Persiste una circular. Devuelve `true` si se insertó,
   * o `false` si ya existía y fue omitida (duplicado).
   */
  save(circular: Circular): boolean;

  /** Devuelve todas las circulares guardadas, de la más reciente a la más antigua. */
  findAll(): StoredCircular[];

  /** Total de circulares almacenadas. */
  count(): number;
}

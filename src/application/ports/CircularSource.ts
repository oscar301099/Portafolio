import type { Circular } from "@/domain/circular/Circular";

/**
 * Puerto de salida que la aplicación usa para obtener circulares del exterior
 * (sitio web de la Aduana). Lo implementa la capa de infraestructura.
 */
export interface CircularSource {
  /** Número total de páginas del listado en el sitio origen. */
  readonly totalPages: number;

  /**
   * Extrae las circulares de una página. `page` es 1-indexada:
   * la página 1 es la primera del listado.
   */
  extractPage(page: number): Promise<Circular[]>;
}

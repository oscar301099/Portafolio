import type { CircularSource } from "@/modules/circulares/application/ports/CircularSource";
import type { CircularRepository } from "@/modules/circulares/domain/circular/CircularRepository";

export type ScrapeSummary = {
  pagesProcessed: number;
  scanned: number;
  inserted: number;
  skipped: number;
};

/** Error de validación de los parámetros del caso de uso. */
export class ScrapeValidationError extends Error {}

/** Ya hay un scraping en curso en esta instancia. */
export class ScrapeBusyError extends Error {}

/**
 * Caso de uso: scrapear las circulares de la Aduana desde la página 1
 * hasta `maxPages` y guardar las nuevas en el repositorio.
 *
 * Solo depende de abstracciones (puertos), nunca de implementaciones concretas.
 */
export class ScrapeCircularesUseCase {
  private running = false;

  constructor(
    private readonly source: CircularSource,
    private readonly repository: CircularRepository
  ) {}

  /**
   * @param maxPages  páginas pedidas por el cliente.
   * @param allowedPages  tope que decide quien invoca (p. ej. menos páginas
   *   para visitantes anónimos). Nunca supera el total del sitio origen.
   */
  async execute(
    maxPages: number,
    allowedPages: number = this.source.totalPages
  ): Promise<ScrapeSummary> {
    const limit = Math.min(allowedPages, this.source.totalPages);

    if (!Number.isInteger(maxPages) || maxPages < 1) {
      throw new ScrapeValidationError(
        "Debes indicar cuántas páginas scrapear (un entero, mínimo 1)."
      );
    }
    if (maxPages > limit) {
      throw new ScrapeValidationError(
        limit < this.source.totalPages
          ? `En esta demo se pueden scrapear hasta ${limit} páginas por ejecución.`
          : `El listado solo tiene ${limit} páginas.`
      );
    }

    // Evita que varias peticiones simultáneas multipliquen las solicitudes
    // al sitio de la Aduana y las escrituras en la base de datos.
    if (this.running) {
      throw new ScrapeBusyError(
        "Ya hay un scraping en curso. Intenta de nuevo en unos segundos."
      );
    }
    this.running = true;

    try {
      const summary: ScrapeSummary = {
        pagesProcessed: maxPages,
        scanned: 0,
        inserted: 0,
        skipped: 0,
      };

      for (let page = 1; page <= maxPages; page++) {
        const items = await this.source.extractPage(page);
        summary.scanned += items.length;

        for (const item of items) {
          // El repositorio garantiza la unicidad (circular, fecha):
          // si ya existe, save() devuelve false y el registro se omite.
          if (await this.repository.save(item)) {
            summary.inserted += 1;
          } else {
            summary.skipped += 1;
          }
        }
      }

      return summary;
    } finally {
      this.running = false;
    }
  }
}

import type { CircularSource } from "@/application/ports/CircularSource";
import type { CircularRepository } from "@/domain/circular/CircularRepository";

export type ScrapeSummary = {
  pagesProcessed: number;
  scanned: number;
  inserted: number;
  skipped: number;
};

/** Error de validación de los parámetros del caso de uso. */
export class ScrapeValidationError extends Error {}

/**
 * Caso de uso: scrapear las circulares de la Aduana desde la página 1
 * hasta `maxPages` y guardar las nuevas en el repositorio.
 *
 * Solo depende de abstracciones (puertos), nunca de implementaciones concretas.
 */
export class ScrapeCircularesUseCase {
  constructor(
    private readonly source: CircularSource,
    private readonly repository: CircularRepository
  ) {}

  async execute(maxPages: number): Promise<ScrapeSummary> {
    if (!Number.isFinite(maxPages) || maxPages < 1) {
      throw new ScrapeValidationError(
        "Debes indicar cuántas páginas scrapear (mínimo 1)."
      );
    }
    if (maxPages > this.source.totalPages) {
      throw new ScrapeValidationError(
        `El listado solo tiene ${this.source.totalPages} páginas.`
      );
    }

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
  }
}

import { GetCircularesUseCase } from "@/application/scraping/GetCirculares";
import { ScrapeCircularesUseCase } from "@/application/scraping/ScrapeCirculares";
import { SqliteCircularRepository } from "@/infrastructure/db/SqliteCircularRepository";
import { AduanaCircularesScraper } from "@/infrastructure/scraping/AduanaCircularesScraper";

export type Container = {
  getCirculares: GetCircularesUseCase;
  scrapeCirculares: ScrapeCircularesUseCase;
  /** Total de páginas del listado en el sitio origen (para la UI). */
  totalPages: number;
};

// Composition root: aquí se ensamblan las capas (inyección de dependencias).
// Se cachea en globalThis para que `next dev` no lo reconstruya en cada HMR.
const globalForContainer = globalThis as unknown as { __container?: Container };

export function getContainer(): Container {
  if (!globalForContainer.__container) {
    const repository = new SqliteCircularRepository();
    const source = new AduanaCircularesScraper();

    globalForContainer.__container = {
      getCirculares: new GetCircularesUseCase(repository),
      scrapeCirculares: new ScrapeCircularesUseCase(source, repository),
      totalPages: source.totalPages,
    };
  }

  return globalForContainer.__container;
}

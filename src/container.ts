import { GetCircularesUseCase } from "@/application/scraping/GetCirculares";
import { ScrapeCircularesUseCase } from "@/application/scraping/ScrapeCirculares";
import { LibsqlCircularRepository } from "@/infrastructure/db/LibsqlCircularRepository";
import { SqliteCircularRepository } from "@/infrastructure/db/SqliteCircularRepository";
import type { CircularRepository } from "@/domain/circular/CircularRepository";
import { AduanaCircularesScraper } from "@/infrastructure/scraping/AduanaCircularesScraper";

export type Container = {
  getCirculares: GetCircularesUseCase;
  scrapeCirculares: ScrapeCircularesUseCase;
  /** Total de páginas del listado en el sitio origen (para la UI). */
  totalPages: number;
};

/**
 * Elige el repositorio según el entorno:
 * - Con TURSO_DATABASE_URL configurada (producción/Vercel) → Turso (libsql),
 *   porque el filesystem serverless es de solo lectura.
 * - Sin ella (desarrollo local) → SQLite sobre el archivo circulares.db.
 */
function createRepository(): CircularRepository {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    return new LibsqlCircularRepository(url, process.env.TURSO_AUTH_TOKEN);
  }
  return new SqliteCircularRepository();
}

// Composition root: aquí se ensamblan las capas (inyección de dependencias).
// Se cachea en globalThis para que `next dev` no lo reconstruya en cada HMR.
const globalForContainer = globalThis as unknown as { __container?: Container };

export function getContainer(): Container {
  if (!globalForContainer.__container) {
    const repository = createRepository();
    const source = new AduanaCircularesScraper();

    globalForContainer.__container = {
      getCirculares: new GetCircularesUseCase(repository),
      scrapeCirculares: new ScrapeCircularesUseCase(source, repository),
      totalPages: source.totalPages,
    };
  }

  return globalForContainer.__container;
}

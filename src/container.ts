import { GetCircularesUseCase } from "@/application/scraping/GetCirculares";
import { ScrapeCircularesUseCase } from "@/application/scraping/ScrapeCirculares";
import type { CircularRepository } from "@/domain/circular/CircularRepository";
import { SqliteCircularRepository } from "@/infrastructure/db/SqliteCircularRepository";
import { SupabaseCircularRepository } from "@/infrastructure/db/SupabaseCircularRepository";
import { AduanaCircularesScraper } from "@/infrastructure/scraping/AduanaCircularesScraper";

export type Container = {
  getCirculares: GetCircularesUseCase;
  scrapeCirculares: ScrapeCircularesUseCase;
  /** Total de páginas del listado en el sitio origen (para la UI). */
  totalPages: number;
};

/**
 * Elige el repositorio según el entorno:
 * - Con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY configuradas (producción/
 *   Vercel) → Supabase (Postgres), porque el filesystem serverless es de
 *   solo lectura.
 * - Sin ellas (desarrollo local) → SQLite sobre el archivo circulares.db.
 */
function createRepository(): CircularRepository {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    return new SupabaseCircularRepository(url, key);
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

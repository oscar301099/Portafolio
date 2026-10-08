import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Comprueba la cabecera `Authorization: Bearer <SCRAPE_TOKEN>`.
 * Con un token válido se permite scrapear todas las páginas del listado;
 * sin SCRAPE_TOKEN configurado, nadie obtiene acceso completo.
 */
export function hasValidScrapeToken(authorization: string | null): boolean {
  const expected = process.env.SCRAPE_TOKEN;
  if (!expected || !authorization?.startsWith("Bearer ")) return false;

  // Se comparan hashes de igual longitud para que la comparación sea de
  // tiempo constante y no revele el token por diferencias de tiempo.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(authorization.slice(7)), digest(expected));
}

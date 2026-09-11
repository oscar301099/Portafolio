import * as cheerio from "cheerio";

import type { CircularSource } from "@/application/ports/CircularSource";
import type { Circular } from "@/domain/circular/Circular";

const BASE_URL = "https://www.aduana.gob.bo/NOR_circulares";

/**
 * Total de páginas del listado de circulares (indexadas desde 1).
 * Se actualizó por última vez el 2026-09-08: la paginación apuntaba a ?page=157.
 */
const TOTAL_PAGES = 158;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Pausa antes de cada solicitud para no saturar el servidor de la Aduana.
const REQUEST_DELAY_MS = 250;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fuente de circulares que extrae los datos del sitio web de la
 * Aduana Nacional de Bolivia (fetch + cheerio).
 */
export class AduanaCircularesScraper implements CircularSource {
  readonly totalPages = TOTAL_PAGES;

  /**
   * `page` es 1-indexada: la página 1 no lleva querystring y las
   * siguientes usan ?page=1, ?page=2, ... (el sitio indexa desde 0).
   */
  async extractPage(page: number): Promise<Circular[]> {
    if (!Number.isInteger(page) || page < 1 || page > this.totalPages) {
      throw new Error(`Página fuera de rango: ${page}`);
    }

    await sleep(REQUEST_DELAY_MS);

    const url = page === 1 ? BASE_URL : `${BASE_URL}?page=${page - 1}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} al obtener la página ${page}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const items: Circular[] = [];

    $("table.views-view-table tbody tr").each((_, tr) => {
      const tds = $(tr).find("td");
      if (tds.length < 6) return;

      items.push({
        nro: Number($(tds[0]).text().trim()),
        circular: $(tds[1]).text().trim(),
        fecha: $(tds[2]).find("time").text().trim(),
        tipo: $(tds[3]).text().trim(),
        resumen: $(tds[4]).text().replace(/\s+/g, " ").trim(),
        enlace: $(tds[5]).find("a").attr("href") ?? "",
      });
    });

    return items;
  }
}

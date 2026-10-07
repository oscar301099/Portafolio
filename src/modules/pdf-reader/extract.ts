import { extractTextItems } from "unpdf";

import { content } from "./data/content";
import { settings } from "./data/settings";
import { parseRows, type PdfRow } from "./parse";
import type { ExtractionResult } from "./types";

/** Error esperado (archivo inválido); se muestra tal cual al usuario. */
export class PdfReaderError extends Error {}

/** Punto de entrada del módulo: valida el archivo, lo lee y devuelve los datos. */
export async function extractFromPdf(file: File): Promise<ExtractionResult> {
  if (file.size > settings.maxFileSizeMb * 1024 * 1024) {
    throw new PdfReaderError(content.errors.tooLarge(settings.maxFileSizeMb));
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isPdf(bytes)) {
    throw new PdfReaderError(content.errors.notPdf);
  }

  const { pages, rows } = await readRows(bytes);
  if (rows.length === 0) {
    throw new PdfReaderError(content.errors.noText);
  }

  return { fileName: file.name, pages, ...parseRows(rows) };
}

function isPdf(bytes: Uint8Array): boolean {
  return new TextDecoder().decode(bytes.subarray(0, 5)) === "%PDF-";
}

/**
 * Reconstruye las filas visuales del PDF: agrupa los textos que comparten
 * la misma altura (Y) y los ordena de izquierda a derecha (X).
 */
async function readRows(bytes: Uint8Array): Promise<{ pages: number; rows: PdfRow[] }> {
  let extracted: Awaited<ReturnType<typeof extractTextItems>>;
  try {
    extracted = await extractTextItems(bytes);
  } catch {
    throw new PdfReaderError(content.errors.unreadable);
  }

  const rows: PdfRow[] = [];

  for (const pageItems of extracted.items) {
    const pageRows: { y: number; items: { x: number; str: string }[] }[] = [];

    for (const item of pageItems) {
      if (!item.str.trim()) continue;
      const row = pageRows.find((r) => Math.abs(r.y - item.y) <= settings.rowTolerance);
      if (row) {
        row.items.push(item);
      } else {
        pageRows.push({ y: item.y, items: [item] });
      }
    }

    // El origen de coordenadas del PDF está abajo: mayor Y = más arriba.
    pageRows.sort((a, b) => b.y - a.y);

    for (const row of pageRows) {
      const tokens = row.items
        .sort((a, b) => a.x - b.x)
        .flatMap((item) => item.str.trim().split(/\s+/));
      rows.push({ text: tokens.join(" "), tokens });
    }
  }

  return { pages: extracted.totalPages, rows };
}

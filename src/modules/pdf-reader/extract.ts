import { extractTextItems, getDocumentProxy } from "unpdf";

import { content } from "./data/content";
import { settings } from "./data/settings";
import { parseRows, type PdfRow } from "./parse";
import type { ExtractionResult } from "./types";

/** Error esperado (archivo inválido); se muestra tal cual al usuario. */
export class PdfReaderError extends Error {}

const maxFileBytes = settings.maxFileSizeMb * 1024 * 1024;
// Margen para las cabeceras y separadores del multipart/form-data.
const maxBodyBytes = maxFileBytes + 64 * 1024;

/**
 * Lee el archivo subido sin cargar en memoria más de `maxBodyBytes`:
 * `request.formData()` leería el cuerpo completo antes de poder validar
 * el tamaño, y en un servidor propio Next.js no limita el body de las rutas.
 */
export async function readPdfUpload(request: Request): Promise<File> {
  const declared = Number(request.headers.get("content-length"));
  if (declared > maxBodyBytes) {
    throw new PdfReaderError(content.errors.tooLarge(settings.maxFileSizeMb));
  }

  const body = await readLimited(request, maxBodyBytes);
  const form = await new Response(body, {
    headers: { "content-type": request.headers.get("content-type") ?? "" },
  })
    .formData()
    .catch(() => null);

  const file = form?.get("file");
  if (!(file instanceof File)) {
    throw new PdfReaderError(content.errors.noFile);
  }
  return file;
}

async function readLimited(
  request: Request,
  limit: number
): Promise<Uint8Array<ArrayBuffer>> {
  if (!request.body) return new Uint8Array(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new PdfReaderError(content.errors.tooLarge(settings.maxFileSizeMb));
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

/** Punto de entrada del módulo: valida el archivo, lo lee y devuelve los datos. */
export async function extractFromPdf(file: File): Promise<ExtractionResult> {
  if (file.size > maxFileBytes) {
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
  let pdf: Awaited<ReturnType<typeof getDocumentProxy>>;
  try {
    pdf = await getDocumentProxy(bytes);
  } catch {
    throw new PdfReaderError(content.errors.unreadable);
  }

  let extracted: Awaited<ReturnType<typeof extractTextItems>>;
  try {
    // Se revisa el número de páginas antes de extraer: unpdf procesa todas a
    // la vez, y un PDF pequeño con miles de páginas consumiría mucha CPU.
    if (pdf.numPages > settings.maxPages) {
      throw new PdfReaderError(content.errors.tooManyPages(settings.maxPages));
    }
    extracted = await extractTextItems(pdf);
  } catch (error) {
    if (error instanceof PdfReaderError) throw error;
    throw new PdfReaderError(content.errors.unreadable);
  } finally {
    // Libera la memoria del documento (en pdf.js 6 se destruye la tarea de carga).
    await pdf.loadingTask.destroy();
  }

  const rows: PdfRow[] = [];

  for (const pageItems of extracted.items) {
    // El origen de coordenadas del PDF está abajo: mayor Y = más arriba.
    // Ordenar primero permite agrupar en una sola pasada.
    const items = pageItems
      .filter((item) => item.str.trim())
      .sort((a, b) => b.y - a.y);

    const pageRows: { y: number; items: { x: number; str: string }[] }[] = [];
    for (const item of items) {
      const current = pageRows.at(-1);
      if (current && current.y - item.y <= settings.rowTolerance) {
        current.items.push(item);
      } else {
        pageRows.push({ y: item.y, items: [item] });
      }
    }

    for (const row of pageRows) {
      const tokens = row.items
        .sort((a, b) => a.x - b.x)
        .flatMap((item) => item.str.trim().split(/\s+/));
      rows.push({ text: tokens.join(" "), tokens });
    }
  }

  return { pages: extracted.totalPages, rows };
}

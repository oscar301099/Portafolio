import { NextRequest } from "next/server";

import {
  ScrapeBusyError,
  ScrapeValidationError,
} from "@/modules/circulares/application/scraping/ScrapeCirculares";
import { getContainer } from "@/modules/circulares/container";
import { hasValidScrapeToken } from "@/modules/circulares/infrastructure/auth/scrapeToken";

// Corta ejecuciones largas en plataformas que respetan este límite (p. ej. Vercel).
export const maxDuration = 60;

type ErrorResponse = { ok: false; error: string };

export async function GET(): Promise<Response> {
  const container = getContainer();
  return Response.json({
    total: await container.getCirculares.count(),
    totalPages: container.totalPages,
    publicMaxPages: container.publicMaxPages,
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  const container = getContainer();

  try {
    const body: unknown = await request.json().catch(() => null);
    const maxPages =
      body && typeof body === "object" && "maxPages" in body
        ? Number(body.maxPages)
        : NaN;

    // Visitantes anónimos: pocas páginas por ejecución. Con token: todo el listado.
    const allowedPages = hasValidScrapeToken(request.headers.get("authorization"))
      ? container.totalPages
      : container.publicMaxPages;

    const summary = await container.scrapeCirculares.execute(maxPages, allowedPages);

    return Response.json({ ok: true, ...summary });
  } catch (error) {
    if (error instanceof ScrapeValidationError) {
      return Response.json(
        { ok: false, error: error.message } satisfies ErrorResponse,
        { status: 400 }
      );
    }
    if (error instanceof ScrapeBusyError) {
      return Response.json(
        { ok: false, error: error.message } satisfies ErrorResponse,
        { status: 429 }
      );
    }

    // El detalle (mensajes de Supabase, HTTP del sitio origen) queda en el log
    // del servidor; al cliente solo se le devuelve un mensaje genérico.
    console.error("[scrape]", error);
    return Response.json(
      { ok: false, error: "Ocurrió un error al scrapear. Intenta de nuevo más tarde." } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}

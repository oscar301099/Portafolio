import { NextRequest } from "next/server";

import { ScrapeValidationError } from "@/application/scraping/ScrapeCirculares";
import { getContainer } from "@/container";

type ErrorResponse = { ok: false; error: string };

export async function GET(): Promise<Response> {
  const container = getContainer();
  return Response.json({
    total: container.getCirculares.count(),
    totalPages: container.totalPages,
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  const container = getContainer();

  try {
    const body = (await request.json().catch(() => ({}))) as {
      maxPages?: number;
    };

    const summary = await container.scrapeCirculares.execute(
      Number(body.maxPages)
    );

    return Response.json({ ok: true, ...summary });
  } catch (error) {
    if (error instanceof ScrapeValidationError) {
      return Response.json(
        { ok: false, error: error.message } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al scrapear.",
      } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}

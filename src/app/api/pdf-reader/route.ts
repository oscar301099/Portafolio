import { content } from "@/modules/pdf-reader/data/content";
import { extractFromPdf, PdfReaderError, readPdfUpload } from "@/modules/pdf-reader/extract";

// Corta ejecuciones largas en plataformas que respetan este límite (p. ej. Vercel).
export const maxDuration = 30;

type ErrorResponse = { ok: false; error: string };

export async function POST(request: Request): Promise<Response> {
  try {
    const file = await readPdfUpload(request);
    const result = await extractFromPdf(file);
    return Response.json({ ok: true, result });
  } catch (error) {
    if (error instanceof PdfReaderError) {
      return Response.json(
        { ok: false, error: error.message } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    console.error("[pdf-reader]", error);
    return Response.json(
      { ok: false, error: content.errors.unknown } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}

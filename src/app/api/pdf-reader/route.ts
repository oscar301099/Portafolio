import { content } from "@/modules/pdf-reader/data/content";
import { extractFromPdf, PdfReaderError } from "@/modules/pdf-reader/extract";

type ErrorResponse = { ok: false; error: string };

export async function POST(request: Request): Promise<Response> {
  try {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");

    if (!(file instanceof File)) {
      throw new PdfReaderError(content.errors.noFile);
    }

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

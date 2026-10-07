import type { Metadata } from "next";

import { content } from "@/modules/pdf-reader/data/content";
import { PdfReaderDashboard } from "@/modules/pdf-reader/ui/PdfReaderDashboard";

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
};

export default function PdfReaderPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-zinc-100">
      <PdfReaderDashboard />
    </main>
  );
}

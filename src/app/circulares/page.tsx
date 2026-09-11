import type { Metadata } from "next";

import { ScrapingDashboard } from "@/components/scraping/ScrapingDashboard";
import { getContainer } from "@/container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Web Scraping · Circulares Aduana Nacional",
  description:
    "Scraper de las circulares de la Aduana Nacional de Bolivia con detección de duplicados y paginación configurable.",
};

export default async function CircularesPage() {
  const container = getContainer();
  const items = await container.getCirculares.execute();

  return (
    <main className="min-h-screen bg-[#050816] text-zinc-100">
      <ScrapingDashboard initialItems={items} totalPages={container.totalPages} />
    </main>
  );
}

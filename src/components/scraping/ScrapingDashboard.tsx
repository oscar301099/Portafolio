"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { StoredCircular } from "@/domain/circular/Circular";
import type { ScrapeSummary } from "@/application/scraping/ScrapeCirculares";

type Props = {
  initialItems: StoredCircular[];
  totalPages: number;
};

export function ScrapingDashboard({ initialItems, totalPages }: Props) {
  const router = useRouter();
  const [maxPages, setMaxPages] = useState(1);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScrapeSummary | null>(null);

  async function handleScrape() {
    setRunning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxPages }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Ocurrió un error durante el scraping.");
      } else {
        setResult(data as ScrapeSummary);
        router.refresh();
      }
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
      >
        &larr; Volver al portafolio
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-cyan-300/80">
          Proyecto 2 · Web Scraping
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Circulares de la Aduana Nacional de Bolivia
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Se extraen las columnas <span className="text-zinc-200">Nro, Circular, Fecha,
          Tipo, Resumen y Enlace</span> del listado oficial. Antes de insertar se
          verifica que la combinación <span className="text-zinc-200">Circular +
          Fecha</span> no exista en la base de datos, así los registros repetidos se
          omiten automáticamente.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
        <div>
          <label
            htmlFor="maxPages"
            className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            Hasta la página
          </label>
          <input
            id="maxPages"
            type="number"
            min={1}
            max={totalPages}
            value={maxPages}
            onChange={(e) => setMaxPages(Number(e.target.value))}
            disabled={running}
            className="w-28 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/60"
          />
          <p className="mt-1 text-xs text-zinc-500">
            El sitio tiene {totalPages} páginas en total (50 circulares por página).
          </p>
        </div>

        <button
          onClick={handleScrape}
          disabled={running}
          className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? "Scrapeando…" : "Iniciar scraping"}
        </button>

        <div className="flex items-center gap-4 text-sm text-zinc-300">
          <span>
            En base de datos:{" "}
            <strong className="text-white">{initialItems.length}</strong>
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Páginas procesadas: <strong>{result.pagesProcessed}</strong> · Registros
          escaneados: <strong>{result.scanned}</strong> · Insertados:{" "}
          <strong>{result.inserted}</strong> · Omitidos por duplicado:{" "}
          <strong>{result.skipped}</strong>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-zinc-500">
                <th className="px-4 py-3 font-medium">Nro</th>
                <th className="px-4 py-3 font-medium">Circular</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Resumen</th>
                <th className="px-4 py-3 font-medium">Enlace</th>
              </tr>
            </thead>
            <tbody>
              {initialItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    Todavía no hay datos. Elige cuántas páginas scrapear y pulsa
                    &quot;Iniciar scraping&quot;.
                  </td>
                </tr>
              ) : (
                initialItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 align-top transition last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 text-zinc-500">{item.nro}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-100">
                      {item.circular}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                      {item.fecha}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                      {item.tipo}
                    </td>
                    <td
                      className="max-w-md px-4 py-3 text-zinc-400 line-clamp-3"
                      title={item.resumen}
                    >
                      {item.resumen}
                    </td>
                    <td className="px-4 py-3">
                      {item.enlace ? (
                        <a
                          href={item.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap font-medium text-cyan-300 transition hover:text-cyan-200"
                        >
                          Ver PDF &rarr;
                        </a>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

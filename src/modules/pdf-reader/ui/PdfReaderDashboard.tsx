"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { content } from "../data/content";
import { settings } from "../data/settings";
import type { ExtractionResult } from "../types";
import { SamplePdf } from "./SamplePdf";
import { StatementCard } from "./StatementCard";

export function PdfReaderDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  // La vista previa del PDF es alta: al terminar, se lleva al usuario a los resultados.
  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError(content.errors.noFile);
      return;
    }
    if (file.size > settings.maxFileSizeMb * 1024 * 1024) {
      setError(content.errors.tooLarge(settings.maxFileSizeMb));
      return;
    }

    extract(file);
  }

  async function handleTrySample() {
    setError(null);
    try {
      const res = await fetch(encodeURI(settings.samplePdf.path));
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      extract(new File([blob], settings.samplePdf.fileName, { type: "application/pdf" }));
    } catch {
      setError(content.errors.sampleUnavailable);
    }
  }

  async function extract(pdf: File) {
    setError(null);
    setResult(null);
    setRunning(true);
    try {
      const body = new FormData();
      body.append("file", pdf);

      const res = await fetch("/api/pdf-reader", { method: "POST", body });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? content.errors.unknown);
      } else {
        setResult(data.result as ExtractionResult);
      }
    } catch {
      setError(content.errors.network);
    } finally {
      setRunning(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.fileName.replace(/\.pdf$/i, "") + ".json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
      >
        {content.page.back}
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-cyan-300/80">
          {content.page.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {content.page.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{content.page.description}</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-5"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="pdfFile"
            className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
          >
            {content.upload.label}
          </label>
          <input
            id="pdfFile"
            type="file"
            accept="application/pdf,.pdf"
            disabled={running}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-100 hover:file:bg-zinc-700"
          />
          <p className="mt-1 text-xs text-zinc-500">
            {content.upload.hint(settings.maxFileSizeMb)}
          </p>
        </div>

        <button
          type="submit"
          disabled={running || !file}
          className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? content.upload.running : content.upload.submit}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <SamplePdf disabled={running} onTry={handleTrySample} />

      {result && (
        <section ref={resultsRef} className="mt-8 scroll-mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-white">{result.fileName}</span>
              <span className="text-zinc-500">· {content.results.pages(result.pages)}</span>
              {result.metadata.map((item) => (
                <span
                  key={item.key}
                  className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300"
                >
                  {item.label}: <span className="text-zinc-100">{item.value}</span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              {content.results.downloadJson}
            </button>
          </div>

          {result.statements.length === 0 ? (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {content.results.noStatements}
            </p>
          ) : (
            result.statements.map((statement) => (
              <StatementCard key={statement.id} statement={statement} />
            ))
          )}
        </section>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import { content } from "../data/content";
import { settings } from "../data/settings";

type Props = {
  disabled: boolean;
  onTry: () => void;
};

// El nombre del archivo puede tener espacios: se codifica para usarlo como URL.
const sampleUrl = encodeURI(settings.samplePdf.path);

export function SamplePdf({ disabled, onTry }: Props) {
  const [visible, setVisible] = useState(true);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="max-w-xl">
          <h2 className="text-sm font-semibold text-white">{content.sample.title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{content.sample.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-expanded={visible}
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            {visible ? content.sample.hide : content.sample.show}
          </button>
          <a
            href={sampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            {content.sample.open}
          </a>
          <a
            href={sampleUrl}
            download={settings.samplePdf.fileName}
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            {content.sample.download}
          </a>
          <button
            type="button"
            onClick={onTry}
            disabled={disabled}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {content.sample.tryIt}
          </button>
        </div>
      </div>

      {visible && (
        <iframe
          src={sampleUrl}
          title={content.sample.frameTitle}
          className="h-[70vh] min-h-[420px] w-full border-t border-white/10 bg-white"
        />
      )}
    </section>
  );
}

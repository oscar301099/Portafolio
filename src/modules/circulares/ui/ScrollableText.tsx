"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  /** Nombre accesible de la región desplazable. */
  label: string;
};

/**
 * Texto con alto máximo y mini-scroll. Mientras quede texto por leer, el pie
 * se desvanece para indicar que hay más contenido (la barra de scroll delgada
 * no siempre es visible, p. ej. en macOS o con barras superpuestas).
 */
export function ScrollableText({ text, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (el) setHasMore(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  // ResizeObserver avisa al montar y cuando cambia el ancho (p. ej. al girar
  // el celular), que es cuando el texto pasa a caber o a desbordar.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div
      ref={ref}
      onScroll={update}
      tabIndex={0}
      aria-label={label}
      className={`max-h-24 overflow-y-auto pr-2 leading-6 scrollbar-thin [scrollbar-color:var(--color-zinc-700)_transparent] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60 ${
        hasMore ? "[mask-image:linear-gradient(to_bottom,black_65%,transparent)]" : ""
      }`}
    >
      {text}
    </div>
  );
}

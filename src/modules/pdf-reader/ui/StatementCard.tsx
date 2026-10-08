import { content } from "../data/content";
import { settings } from "../data/settings";
import type { CheckStatus, ExtractedStatement, RowKind } from "../types";

const amountFormat = new Intl.NumberFormat(settings.locale, {
  minimumFractionDigits: settings.numberFormat.decimals,
  maximumFractionDigits: settings.numberFormat.decimals,
});

const formatAmount = (value: number | null) =>
  value === null ? "—" : amountFormat.format(value);

// El padding no aplica sobre <tr>: el estilo de la fila va en `row` y la
// sangría/espaciado de la celda de la cuenta va en `label`.
const rowStyles: Record<RowKind, { row: string; label: string }> = {
  heading: {
    row: "text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/80",
    label: "pt-5",
  },
  group: { row: "font-medium text-zinc-100", label: "" },
  item: { row: "text-zinc-400", label: "pl-8 sm:pl-10" },
  total: { row: "border-t border-white/10 font-semibold text-white", label: "" },
};

const statusStyles: Record<CheckStatus, string> = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  mismatch: "border-red-500/40 bg-red-500/10 text-red-300",
  missing: "border-amber-500/40 bg-amber-500/10 text-amber-200",
};

export function StatementCard({ statement }: { statement: ExtractedStatement }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 px-5 py-4">
        <h2 className="text-xl font-semibold text-white">{statement.title}</h2>
        <div className="flex flex-wrap gap-2">
          {statement.metadata.map((item) => (
            <span
              key={item.key}
              className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300"
            >
              {item.label}: <span className="text-zinc-100">{item.value}</span>
            </span>
          ))}
        </div>
      </header>

      {/* Dos columnas caben en cualquier ancho: la cuenta se ajusta en varias
          líneas y el monto nunca se corta, así no hace falta scroll horizontal. */}
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-zinc-500">
            <th className="px-4 py-3 font-medium sm:px-5">{content.results.account}</th>
            <th className="w-32 px-4 py-3 text-right font-medium sm:w-40 sm:px-5">
              {content.results.amount}
            </th>
          </tr>
        </thead>
        <tbody>
          {statement.rows.map((row, index) => (
            <tr key={`${row.label}-${index}`} className={rowStyles[row.kind].row}>
              <td className={`wrap-break-word px-4 py-2 sm:px-5 ${rowStyles[row.kind].label}`}>
                {row.label}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-right align-top tabular-nums sm:px-5">
                {row.kind === "heading" ? "" : formatAmount(row.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {statement.checks.length > 0 && (
        <div className="border-t border-white/10 px-5 py-4">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            {content.results.checks}
          </h3>
          <ul className="space-y-2">
            {statement.checks.map((check) => (
              <li
                key={check.label}
                className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/2 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span className="text-zinc-200">{check.label}</span>
                <span className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  {check.status === "missing" ? (
                    <span>
                      {content.results.missing} {check.missing.join(", ")}
                    </span>
                  ) : (
                    <span className="tabular-nums">
                      {content.results.expected} {formatAmount(check.expected)} ·{" "}
                      {content.results.actual} {formatAmount(check.actual)}
                    </span>
                  )}
                  <span
                    className={`rounded-full border px-2 py-0.5 font-medium ${statusStyles[check.status]}`}
                  >
                    {content.results.status[check.status]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

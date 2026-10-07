import { settings } from "./data/settings";
import { statements } from "./data/statements";
import type { CheckResult } from "./types";

type Values = Record<string, Record<string, number>>;

/** Ejecuta las verificaciones definidas en data/statements.ts para un estado. */
export function runChecks(statementId: string, values: Values): CheckResult[] {
  const definition = statements.find((statement) => statement.id === statementId);
  if (!definition) return [];

  return definition.checks.map((check) => {
    const missing: string[] = [];

    const resolveRef = (ref: string): number | null => {
      const { sign, statement, key } = parseRef(ref, statementId);
      const value = values[statement]?.[key];
      if (value === undefined) {
        missing.push(fieldLabel(statement, key));
        return null;
      }
      return sign * value;
    };

    const expected = resolveRef(check.left);
    const terms = check.right.map(resolveRef);

    if (expected === null || terms.some((term) => term === null)) {
      return { label: check.label, status: "missing", expected, actual: null, missing };
    }

    const actual = round(terms.reduce<number>((sum, term) => sum + term!, 0));
    const ok = Math.abs(expected - actual) <= settings.checkTolerance;

    return {
      label: check.label,
      status: ok ? "ok" : "mismatch",
      expected,
      actual,
      missing,
    };
  });
}

/** "-balance-general.resultadoPeriodo" → { sign: -1, statement: "balance-general", key: "resultadoPeriodo" } */
function parseRef(ref: string, currentStatement: string) {
  const sign = ref.startsWith("-") ? -1 : 1;
  const path = sign === -1 ? ref.slice(1) : ref;
  const dot = path.lastIndexOf(".");

  return dot === -1
    ? { sign, statement: currentStatement, key: path }
    : { sign, statement: path.slice(0, dot), key: path.slice(dot + 1) };
}

function fieldLabel(statementId: string, key: string): string {
  const statement = statements.find((s) => s.id === statementId);
  const field = statement?.fields.find((f) => f.key === key);
  return field ? `${field.label} (${statement!.title})` : `${statementId}.${key}`;
}

const round = (value: number) => Math.round(value * 100) / 100;

import { settings } from "./data/settings";
import { statements } from "./data/statements";
import type {
  ExtractedRow,
  ExtractedStatement,
  ExtractionResult,
  FieldDefinition,
  MetadataDefinition,
  MetadataValue,
  StatementDefinition,
} from "./types";
import { runChecks } from "./verify";

/** Una fila visual del PDF, ya ordenada de izquierda a derecha. */
export type PdfRow = {
  text: string;
  tokens: string[];
};

type Section = {
  definition: StatementDefinition;
  rows: PdfRow[];
};

/**
 * Convierte las filas del PDF en datos: separa el documento en estados
 * financieros (por su título), extrae metadatos y montos, y verifica.
 * Es una función pura: no sabe nada de archivos ni de PDF.
 */
export function parseRows(
  rows: PdfRow[]
): Pick<ExtractionResult, "metadata" | "statements"> {
  const metadata: MetadataValue[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const row of rows) {
    if (settings.ignoreRows.some((pattern) => pattern.test(row.text))) continue;

    const definition = findStatement(row.text);
    if (definition) {
      // Un título repetido (p. ej. al inicio de cada página) continúa la misma sección.
      if (current?.definition.id !== definition.id) {
        current = { definition, rows: [] };
        sections.push(current);
      }
      continue;
    }

    if (!current) {
      collectMetadata(row.text, settings.documentMetadata, metadata);
      continue;
    }

    current.rows.push(row);
  }

  const parsed = sections.map(parseSection);

  const valuesByStatement: Record<string, Record<string, number>> = {};
  for (const { statement, values } of parsed) {
    valuesByStatement[statement.id] = values;
  }

  return {
    metadata,
    statements: parsed.map(({ statement }) => ({
      ...statement,
      checks: runChecks(statement.id, valuesByStatement),
    })),
  };
}

function parseSection({ definition, rows }: Section): {
  statement: Omit<ExtractedStatement, "checks">;
  values: Record<string, number>;
} {
  const metadata: MetadataValue[] = [];
  const extracted: ExtractedRow[] = [];
  const values: Record<string, number> = {};

  for (const row of rows) {
    if (collectMetadata(row.text, definition.metadata, metadata)) continue;

    const firstAmount = row.tokens.findIndex(isAmount);
    if (firstAmount === -1) {
      extracted.push({ label: row.text, amount: null, kind: "heading" });
      continue;
    }

    // El "-" suelto antes del monto es solo presentación contable (resta); el
    // signo de cada cuenta lo definen las verificaciones en data/statements.ts.
    const labelTokens = row.tokens.slice(0, firstAmount);
    while (labelTokens.at(-1) === "-") labelTokens.pop();
    const label = labelTokens.join(" ");
    const amount = parseAmount(row.tokens.findLast(isAmount)!);
    const field = findField(definition.fields, label);

    if (field && !(field.key in values)) {
      values[field.key] = amount;
    }

    extracted.push({
      label,
      amount,
      kind: field?.kind ?? "item",
      fieldKey: field?.key,
    });
  }

  return {
    statement: {
      id: definition.id,
      title: definition.title,
      metadata,
      rows: extracted,
    },
    values,
  };
}

/** Agrega el primer valor de cada metadato que coincida. Devuelve true si la fila era un metadato. */
function collectMetadata(
  text: string,
  definitions: MetadataDefinition[],
  target: MetadataValue[]
): boolean {
  for (const definition of definitions) {
    const match = text.match(definition.pattern);
    if (!match) continue;
    if (!target.some((item) => item.key === definition.key)) {
      target.push({
        key: definition.key,
        label: definition.label,
        value: (match[1] ?? match[0]).trim(),
      });
    }
    return true;
  }
  return false;
}

function findStatement(text: string): StatementDefinition | undefined {
  const normalized = normalize(text);
  return statements.find((statement) =>
    statement.titles.some((title) => normalize(title) === normalized)
  );
}

function findField(fields: FieldDefinition[], label: string): FieldDefinition | undefined {
  const normalized = normalize(label);
  return fields.find((field) =>
    [field.label, ...(field.aliases ?? [])].some((name) => normalize(name) === normalized)
  );
}

/** "(-) IVA - Crédito Fiscal" → "iva credito fiscal" */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\(-\)/g, " ")
    .replace(/[^a-z0-9/]+/g, " ")
    .trim();
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const { thousands, decimal, decimals } = settings.numberFormat;
const AMOUNT_PATTERN = new RegExp(
  `^\\(?-?\\d{1,3}(?:${escapeRegExp(thousands)}\\d{3})*${escapeRegExp(decimal)}\\d{${decimals}}\\)?$`
);

function isAmount(token: string): boolean {
  return AMOUNT_PATTERN.test(token);
}

/** "1.234,56" → 1234.56 (siempre positivo, ver comentario en parseSection). */
function parseAmount(token: string): number {
  const digits = token
    .replace(/[()-]/g, "")
    .split(thousands)
    .join("")
    .replace(decimal, ".");
  return Number(digits);
}

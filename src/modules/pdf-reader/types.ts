// ---------------------------------------------------------------------------
// Configuración (se define en data/)
// ---------------------------------------------------------------------------

/** Cómo se muestra una fila: título de sección, cuenta, subtotal o total. */
export type RowKind = "heading" | "item" | "group" | "total";

/** Cuenta que el extractor reconoce por su etiqueta en el PDF. */
export type FieldDefinition = {
  /** Identificador usado en las verificaciones (ej. "totalActivo"). */
  key: string;
  /** Etiqueta tal como aparece en el PDF (sin importar mayúsculas ni tildes). */
  label: string;
  /** Otras formas en que puede aparecer la misma cuenta. */
  aliases?: string[];
  kind: Exclude<RowKind, "heading">;
};

/** Dato que se lee de una línea de texto con una expresión regular. */
export type MetadataDefinition = {
  key: string;
  label: string;
  /** Si tiene un grupo de captura, se usa el grupo; si no, la línea completa. */
  pattern: RegExp;
};

/**
 * Verificación aritmética: `left` debe ser igual a la suma de `right`.
 * - Prefijo "-" resta el valor (ej. "-costoVenta").
 * - "otroEstado.campo" referencia un campo de otro estado financiero.
 */
export type CheckDefinition = {
  label: string;
  left: string;
  right: string[];
};

/** Un tipo de estado financiero que el extractor sabe reconocer. */
export type StatementDefinition = {
  id: string;
  title: string;
  /** Títulos que marcan el inicio del estado dentro del PDF. */
  titles: string[];
  metadata: MetadataDefinition[];
  fields: FieldDefinition[];
  checks: CheckDefinition[];
};

// ---------------------------------------------------------------------------
// Resultado de la extracción (se envía al cliente como JSON)
// ---------------------------------------------------------------------------

export type MetadataValue = {
  key: string;
  label: string;
  value: string;
};

export type ExtractedRow = {
  label: string;
  amount: number | null;
  kind: RowKind;
  /** Clave del campo reconocido, si la etiqueta coincide con la configuración. */
  fieldKey?: string;
};

export type CheckStatus = "ok" | "mismatch" | "missing";

export type CheckResult = {
  label: string;
  status: CheckStatus;
  /** Valor de `left` leído del PDF. */
  expected: number | null;
  /** Suma calculada de `right`. */
  actual: number | null;
  /** Etiquetas de los campos que no se encontraron. */
  missing: string[];
};

export type ExtractedStatement = {
  id: string;
  title: string;
  metadata: MetadataValue[];
  rows: ExtractedRow[];
  checks: CheckResult[];
};

export type ExtractionResult = {
  fileName: string;
  pages: number;
  metadata: MetadataValue[];
  statements: ExtractedStatement[];
};

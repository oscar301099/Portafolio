import type { MetadataDefinition } from "../types";

// Ajustes de lectura del PDF. Cambiar aquí si llegan documentos con otro
// formato numérico, otros encabezados o archivos más pesados.
export const settings = {
  /** Tamaño máximo del archivo (Vercel limita el body de una función a ~4,5 MB). */
  maxFileSizeMb: 4,

  /** PDF de ejemplo con el que se desarrolló la demo (ruta relativa a /public). */
  samplePdf: {
    path: "/balance general ejemplo.pdf",
    fileName: "balance general ejemplo.pdf",
  },

  /** Formato de los montos en el PDF: 1.234,56 */
  numberFormat: {
    thousands: ".",
    decimal: ",",
    decimals: 2,
  },

  /** Locale para mostrar los montos en la interfaz. */
  locale: "es-BO",

  /** Diferencia máxima aceptada en las verificaciones (redondeos). */
  checkTolerance: 0.01,

  /** Distancia vertical máxima (en puntos) para considerar dos textos en la misma fila. */
  rowTolerance: 2,

  /** Datos generales del documento, buscados antes del primer estado financiero. */
  documentMetadata: [
    { key: "titular", label: "Titular", pattern: /^nombre:\s*(.+)$/i },
    { key: "empresa", label: "Empresa", pattern: /^(?:empresa|razon social|razón social):\s*(.+)$/i },
    { key: "nit", label: "NIT", pattern: /^nit:?\s*(.+)$/i },
  ] satisfies MetadataDefinition[],

  /** Filas que se descartan (firmas, pies de página, etc.). */
  ignoreRows: [/^firma\b/i, /^p[aá]gina\s+\d+/i],
};

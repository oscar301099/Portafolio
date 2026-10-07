import type { MetadataDefinition, StatementDefinition } from "../types";

// Datos que aparecen debajo del título de cada estado financiero.
const statementMetadata: MetadataDefinition[] = [
  { key: "periodo", label: "Periodo", pattern: /^((?:al|del)\s.*\d{4})$/i },
  { key: "moneda", label: "Moneda", pattern: /^expresado en\s+(.+)$/i },
];

// En este array se definen los estados financieros que el extractor reconoce.
// Para soportar un estado nuevo, una cuenta con otro nombre o una verificación
// adicional, solo se edita este archivo.
//
// No hace falta listar todas las cuentas: las que no estén aquí se extraen
// igual como filas normales. Solo se declaran las que dan formato
// (subtotales y totales) o las que usan las verificaciones.
export const statements: StatementDefinition[] = [
  {
    id: "balance-general",
    title: "Balance General",
    titles: ["Balance General"],
    metadata: statementMetadata,
    fields: [
      { key: "activoCorriente", label: "Activo Corriente", kind: "group" },
      { key: "activoDisponible", label: "Activo Disponible", kind: "group" },
      { key: "activoExigible", label: "Activo Exigible", kind: "group" },
      { key: "activoRealizable", label: "Activo Realizable", kind: "group" },
      { key: "activoNoCorriente", label: "Activo No Corriente", kind: "group" },
      { key: "activoFijo", label: "Activo Fijo", kind: "group" },
      { key: "totalActivo", label: "Total Activo", kind: "total" },
      { key: "pasivoCorriente", label: "Pasivo Corriente", kind: "group" },
      { key: "pasivoNoCorriente", label: "Pasivo No Corriente", kind: "group" },
      { key: "totalPasivo", label: "Total Pasivo", kind: "total" },
      { key: "capitalSocial", label: "Capital Social", aliases: ["Capital"], kind: "item" },
      { key: "resultadosAcumulados", label: "Resultados Acumulados", kind: "item" },
      {
        key: "resultadoPeriodo",
        label: "Resultado del Periodo",
        aliases: ["Resultado de la Gestion", "Resultado del Ejercicio"],
        kind: "item",
      },
      { key: "totalPatrimonio", label: "Total Patrimonio", kind: "total" },
      { key: "totalPasivoPatrimonio", label: "Total Pasivo y Patrimonio", kind: "total" },
    ],
    checks: [
      {
        label: "Activo Corriente = Disponible + Exigible + Realizable",
        left: "activoCorriente",
        right: ["activoDisponible", "activoExigible", "activoRealizable"],
      },
      {
        label: "Total Activo = Activo Corriente + Activo No Corriente",
        left: "totalActivo",
        right: ["activoCorriente", "activoNoCorriente"],
      },
      {
        label: "Total Patrimonio = Capital + Resultados Acumulados + Resultado del Periodo",
        left: "totalPatrimonio",
        right: ["capitalSocial", "resultadosAcumulados", "resultadoPeriodo"],
      },
      {
        label: "Total Pasivo y Patrimonio = Total Pasivo + Total Patrimonio",
        left: "totalPasivoPatrimonio",
        right: ["totalPasivo", "totalPatrimonio"],
      },
      {
        label: "Ecuación contable: Activo = Pasivo + Patrimonio",
        left: "totalActivo",
        right: ["totalPasivo", "totalPatrimonio"],
      },
    ],
  },
  {
    id: "estado-resultados",
    title: "Estado de Resultados",
    titles: ["Estado de Resultados"],
    metadata: statementMetadata,
    fields: [
      { key: "ventas", label: "Ventas", aliases: ["Ingresos por Ventas"], kind: "item" },
      { key: "costoVenta", label: "Costo de Venta", aliases: ["Costo de Ventas"], kind: "item" },
      { key: "utilidadBruta", label: "Utilidad Bruta", kind: "total" },
      { key: "gastosOperativos", label: "Gastos Operativos", kind: "group" },
      {
        key: "uai",
        label: "Utilidad antes de impuestos UAI",
        aliases: ["Utilidad antes de impuestos"],
        kind: "total",
      },
    ],
    checks: [
      {
        label: "Utilidad Bruta = Ventas − Costo de Venta",
        left: "utilidadBruta",
        right: ["ventas", "-costoVenta"],
      },
      {
        label: "UAI = Utilidad Bruta − Gastos Operativos",
        left: "uai",
        right: ["utilidadBruta", "-gastosOperativos"],
      },
      {
        label: "UAI = Resultado del Periodo del Balance General",
        left: "uai",
        right: ["balance-general.resultadoPeriodo"],
      },
    ],
  },
];

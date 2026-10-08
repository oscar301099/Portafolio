// Textos de la demo. Para cambiar cualquier texto visible, editar solo aquí.
export const content = {
  meta: {
    title: "Lector de PDF · Estados financieros",
    description:
      "Extrae el Balance General y el Estado de Resultados de un PDF y verifica que las cuentas cuadren.",
  },
  page: {
    back: "← Volver al portafolio",
    eyebrow: "Proyecto · Lectura de PDF",
    title: "Extractor de estados financieros",
    description:
      "Sube un PDF con un Balance General y/o un Estado de Resultados. Se reconstruyen las filas a partir de la posición del texto, se identifican las cuentas y se verifica que los subtotales, los totales y la ecuación contable cuadren.",
  },
  upload: {
    label: "Archivo PDF",
    hint: (maxMb: number) => `Solo archivos PDF con texto (no escaneados), hasta ${maxMb} MB.`,
    submit: "Extraer datos",
    running: "Procesando…",
  },
  sample: {
    title: "PDF de ejemplo",
    description:
      "Documento con el que se desarrolló y probó esta demo: un Balance General y un Estado de Resultados en una sola página.",
    show: "Ver PDF",
    hide: "Ocultar PDF",
    open: "Abrir en otra pestaña",
    download: "Descargar",
    tryIt: "Procesar este PDF",
    frameTitle: "Vista previa del PDF de ejemplo",
  },
  results: {
    pages: (count: number) => `${count} ${count === 1 ? "página" : "páginas"}`,
    noStatements:
      "No se reconoció ningún estado financiero en el PDF. Revisa que el documento tenga un título como «Balance General» o «Estado de Resultados».",
    account: "Cuenta",
    amount: "Monto",
    checks: "Verificaciones",
    status: {
      ok: "Cuadra",
      mismatch: "No cuadra",
      missing: "Faltan datos",
    },
    expected: "En el PDF",
    actual: "Calculado",
    missing: "No encontrado:",
    downloadJson: "Descargar JSON",
  },
  errors: {
    noFile: "Selecciona un archivo PDF.",
    notPdf: "El archivo no es un PDF válido.",
    tooLarge: (maxMb: number) => `El archivo supera el límite de ${maxMb} MB.`,
    tooManyPages: (max: number) => `El PDF tiene demasiadas páginas (máximo ${max}).`,
    unreadable: "No se pudo leer el contenido del PDF.",
    noText: "El PDF no contiene texto seleccionable (¿es un documento escaneado?).",
    network: "No se pudo contactar con el servidor.",
    sampleUnavailable: "No se pudo cargar el PDF de ejemplo.",
    unknown: "Ocurrió un error al procesar el PDF.",
  },
};

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  year: number;
  githubUrl?: string;
  demoUrl?: string;
  /** Ruta de la imagen de portada, relativa a /public (ej. "/projects/mi-app.webp"). */
  image?: string;
  accent: string;
};

// En este array centralizamos los proyectos para facilitar futuras incorporaciones.
export const projects: Project[] = [
  {
    id: "web-scraping-aduana",
    name: "Web Scraping Circulares Aduana",
    category: "Web Scraping · Next.js + cheerio + SQLite",
    description:
      "Scraper del listado de circulares de la Aduana Nacional de Bolivia con paginación configurable, detección de duplicados por Circular + Fecha y almacenamiento en SQLite.",
    year: 2026,
    githubUrl: "https://github.com/oscar301099/Portafolio",
    demoUrl: "/circulares",
    image: "/proyectoCircularesImagen.png",
    accent: "from-emerald-500/25 via-teal-500/10 to-zinc-900",
  },
  {
    id: "pdf-reader",
    name: "Extractor de Estados Financieros",
    category: "Lectura de PDF · Next.js + unpdf",
    description:
      "Extrae el Balance General y el Estado de Resultados de un PDF reconstruyendo las filas por la posición del texto, identifica las cuentas y verifica que subtotales, totales y la ecuación contable cuadren.",
    year: 2026,
    githubUrl: "https://github.com/oscar301099/Portafolio",
    demoUrl: "/pdf-reader",
    image: "/ProyectoExtractorDeEstadosFinancierosImagen.png",
    accent: "from-indigo-500/25 via-cyan-500/10 to-zinc-900",
  },
];

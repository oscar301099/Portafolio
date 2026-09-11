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
];

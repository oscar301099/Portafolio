export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
  stack?: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Ágora",
    role: "Desarrollador de Software",
    period: "Jul 2025 - Ago 2026",
    description:
      "Desarrollo de microservicios backend, integración de APIs REST, automatización de procesos con n8n y análisis de documentos con Azure Document AI.",
    stack: ["C#", ".NET", "SQL Server","Node.js", "APIs REST", "n8n", "Python", "Azure Document AI"],
  },
  {
    company: "Souris",
    role: "Desarrollo de Software / Dev Junior Frontend",
    period: "Ago 2024 - Nov 2024",
    description:
      "Desarrollo frontend con Next.js, pruebas unitarias con Jest y metodologías ágiles (Scrum).",
    stack: ["Next.js", "Jest", "Scrum", "CI/CD"],
  },
  {
    company: "Ágora",
    role: "Desarrollador de Software",
    period: "Feb 2024 - Jun 2024",
    description:
      "Desarrollo de aplicaciones empresariales en .NET, integración con SQL Server.",
    stack: ["C#", ".NET", "SQL Server"],
  },
  {
    company: "EduServer",
    role: "Pasantía en Desarrollo Web Front-End",
    period: "Sep 2023 - Dic 2023",
    description:
      "Desarrollo de interfaces de usuario y funcionalidades front-end.",
    stack: ["HTML", "CSS", "JavaScript","React"],
  },
];
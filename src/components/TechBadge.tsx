import type { IconType } from "react-icons";
import { DiMsqlServer } from "react-icons/di";
import {
  SiCss,
  SiDotnet,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiPython,
} from "react-icons/si";
import { TbBrandAzure, TbBrandCSharp } from "react-icons/tb";

type TechIcon = {
  Icon: IconType;
  color: string;
};

const techIcons: Record<string, TechIcon> = {
  "Node.js": { Icon: SiNodedotjs, color: "#339933" },
  "APIs REST": { Icon: SiOpenapiinitiative, color: "#6BA539" },
  n8n: { Icon: SiN8N, color: "#EA4B71" },
  Python: { Icon: SiPython, color: "#3776AB" },
  "Azure Document AI": { Icon: TbBrandAzure, color: "#0078D4" },
  "Next.js": { Icon: SiNextdotjs, color: "#ffffff" },
  Jest: { Icon: SiJest, color: "#C21325" },
  "CI/CD": { Icon: SiGithubactions, color: "#2088FF" },
  "C#": { Icon: TbBrandCSharp, color: "#239120" },
  ".NET": { Icon: SiDotnet, color: "#512BD4" },
  "SQL Server": { Icon: DiMsqlServer, color: "#CC2927" },
  HTML: { Icon: SiHtml5, color: "#E34F26" },
  CSS: { Icon: SiCss, color: "#1572B6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
};

export function TechBadge({ name }: { name: string }) {
  const tech = techIcons[name];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
      {tech ? (
        <tech.Icon className="h-3.5 w-3.5" style={{ color: tech.color }} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
      )}
      {name}
    </span>
  );
}

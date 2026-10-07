"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
const stack = [
  "TypeScript",
  "Node.js",
  "NestJS",
  "React",
  "Next.js",
  "C#/.NET",
  "Python",
  "PostgreSQL",
  "SQL Server",
  "Docker",
  "Git",
  "N8N"
];
function useTypewriter(
  text: string,
  speed: number = 80,
  startDelay: number = 500
) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;

    const timer = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, started]);

  return displayText;
}
const profileLinks = [
  {
    label: "GitHub",
    href: "https://github.com/oscar301099",
    target: "_blank",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/oscar-oros-duran-02b815244",
    target: "_blank",
  },
  {
    label: "Email",
    href: "mailto:oros.duran.oscar@gmail.com",
    target: "_blank",
  },
{
  label: "Curriculum Vitae",
  href: "/Oscar-Oros-Duran-CV.pdf",
  download: true,
},
];

export function Hero() {
  const role = useTypewriter(
    "Ingeniero en Sistemas · Full Stack Developer",
    60,
    800
  );
 const name = useTypewriter(
    "Oscar Oros Duran",
    60,
    800
  );
  return (
    <section className="relative isolate overflow-hidden bg-[#050816] text-zinc-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_28%)]" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[28px] border border-white/10 bg-white/4 px-6 py-8 shadow-[0_0_50px_rgba(14,165,233,0.08)] backdrop-blur-sm sm:px-8 lg:px-10 lg:py-12"
        >
          <header className="mb-10 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/8 px-3 py-1.5 text-xs font-medium text-cyan-200">
              <span aria-label="Bolivia">🇧🇴</span>
              Bolivia
            </div>

            <a
              href="#projects"
              className="hidden text-sm text-zinc-300 transition hover:text-white sm:inline-flex"
            >
              Proyectos
            </a>
          </header>

          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-cyan-300/80">
                Portfolio personal
              </p>

              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {name}
              </h1>

             <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />

              <span>
                {role}
                <span className="ml-0.5 animate-pulse text-cyan-400">|</span>
              </span>
            </div>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                Desarrollo aplicaciones web, APIs e integraciones que automatizan procesos y conectan sistemas. Trabajo desde el frontend hasta el backend, bases de datos y automatización.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {profileLinks.map((item) => (
                 <a
                    key={item.label}
                    href={item.href}
                    download={item.download ? "Oscar-Oros-Duran-CV.pdf" : undefined}
                    target={item.target === "_blank" ? "_blank" : undefined}
                    rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    className={
                         "inline-flex items-center justify-center rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    }
                    >
                    {item.label}
                    </a>
                ))}

               
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative mx-auto w-full max-w-sm"
            >
              <div className="absolute inset-0 -z-10 rounded-[30px] bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-transparent blur-2xl" />
              <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.7)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-zinc-400">Estado</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Disponible
                  </span>
                </div>

             <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-0.5">
                <Image
                    src="/FotoPersonal.webp"
                    alt="Oscar Oros"
                    width={64}
                    height={64}
                    className="h-full w-full rounded-[14px] object-cover"
                />
                </div>

                <div>
                    <p className="text-lg font-semibold text-white">Oscar Oros</p>
                    <p className="text-sm text-zinc-400">Full Stack Developer</p>
                </div>
             </div>

                <div className="mt-6 space-y-3 text-sm text-zinc-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/3 px-3 py-2">
                    <span>Rol</span>
                    <span className="text-cyan-300">Fullstack</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/3 px-3 py-2">
                    <span>Ubicación</span>
                    <span className="text-cyan-300">Santa Cruz, BO</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
              Stack principal
            </p>
            <div className="flex flex-wrap gap-2.5">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

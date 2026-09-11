"use client";

import { motion } from "framer-motion";

import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section className="bg-[#050816] px-6 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-cyan-300/80">
            Experiencia
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Mi trayectoria 
          </h2>
        </div>

        <div className="relative space-y-8 before:absolute before:left-[12px] before:top-2 before:h-[calc(100%-0.5rem)] before:w-px before:bg-white/10">
          {experience.map((item, index) => (
            <motion.div
              key={`${item.company}-${item.period}`}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              className="relative pl-12"
            >
              <span className="absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 text-[10px] text-cyan-300">
                •
              </span>

              <div className="rounded-[24px] border border-white/10 bg-zinc-950/70 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.company}</p>
                    <p className="mt-1 text-base text-cyan-300">{item.role}</p>
                  </div>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
                    {item.period}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-300">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

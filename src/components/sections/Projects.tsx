"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="bg-[#0a0f1f] px-6 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-cyan-300/80">
            Portfolio
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Cosas que construí por mi cuenta 
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
            >
              <div className={`relative h-40 bg-gradient-to-br ${project.accent}`}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`Captura del proyecto ${project.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top"
                  />
                ) : null}
                <div className="relative flex h-full items-end justify-between p-5">
                  <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-100">
                    {project.year}
                  </span>

                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Proyecto</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{project.name}</h3>
                </div>

                <p className="text-sm font-medium text-zinc-300">{project.category}</p>
                <p className="text-sm leading-6 text-zinc-400">{project.description}</p>

                <div className="flex items-center justify-between gap-3 pt-2">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      GitHub
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-500">GitHub</span>
                  )}

                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-zinc-200 transition hover:text-white"
                    >
                      Demo
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-500">Demo</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

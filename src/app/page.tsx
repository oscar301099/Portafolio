import { Experience } from "@/portfolio/sections/Experience";
import { Footer } from "@/portfolio/sections/Footer";
import { Hero } from "@/portfolio/sections/Hero";
import { Projects } from "@/portfolio/sections/Projects";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-zinc-100">
      <Hero />
      <Projects />
      <Experience />
      <Footer />
    </main>
  );
}

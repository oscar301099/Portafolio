import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";

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

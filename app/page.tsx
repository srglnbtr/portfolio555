import Navbar from "@/components/portfolio/Navbar";
import ScrollyCanvas from "@/components/portfolio/ScrollyCanvas";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Contact from "@/components/portfolio/Contact";

export default function Home() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <ScrollyCanvas />
      <Projects />
      <Skills />
      <Contact />
      <footer className="py-10 text-center text-white/20 text-xs uppercase tracking-widest border-t border-white/5">
        © {new Date().getFullYear()} Your Name — Built with Next.js + Firebase
      </footer>
    </main>
  );
}

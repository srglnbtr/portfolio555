"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProjects, type Project } from "@/lib/firestore";

const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Project One",
    description: "A stunning web application built with modern technologies.",
    image: "",
    tags: ["Next.js", "Firebase", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "2",
    title: "Project Two",
    description: "Mobile-first design with seamless user experience.",
    image: "",
    tags: ["React Native", "Node.js"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "3",
    title: "Project Three",
    description: "Full-stack platform with real-time capabilities.",
    image: "",
    tags: ["Vue.js", "PostgreSQL", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.length ? data : DEMO_PROJECTS))
      .catch(() => setProjects(DEMO_PROJECTS));
  }, []);

  return (
    <section id="projects" className="py-32 px-6 md:px-16 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-orange-400 mb-4">
            Selected Work
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-white">
            Projects
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-orange-400/40 hover:shadow-[0_0_40px_rgba(251,146,60,0.1)] transition-all duration-500"
            >
              {/* Image area */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-900/40 to-orange-900/40">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400/30 to-blue-400/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white/40">
                        {p.title[0]}
                      </span>
                    </div>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-md bg-white/10 text-white/60 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center text-xs uppercase tracking-widest text-orange-400 border border-orange-400/30 rounded-lg hover:bg-orange-400/10 transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center text-xs uppercase tracking-widest text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-400/10 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

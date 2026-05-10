"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSkills, type Skill } from "@/lib/firestore";

const DEMO_SKILLS: Skill[] = [
  { id: "1", name: "React / Next.js", category: "Frontend", level: 90 },
  { id: "2", name: "TypeScript", category: "Frontend", level: 85 },
  { id: "3", name: "Three.js / GSAP", category: "Frontend", level: 75 },
  { id: "4", name: "Node.js", category: "Backend", level: 80 },
  { id: "5", name: "Firebase", category: "Backend", level: 85 },
  { id: "6", name: "UI / UX Design", category: "Design", level: 70 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "orange",
  Backend: "blue",
  Design: "purple",
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills()
      .then((d) => setSkills(d.length ? d : DEMO_SKILLS))
      .catch(() => setSkills(DEMO_SKILLS));
  }, []);

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="py-32 px-6 md:px-16 bg-[#080810]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-blue-400 mb-4">
            What I know
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-white">Skills</h2>
        </motion.div>

        {categories.map((cat) => (
          <div key={cat} className="mb-12">
            <p className="text-xs uppercase tracking-widest text-white/30 mb-6">
              {cat}
            </p>
            <div className="space-y-5">
              {skills
                .filter((s) => s.category === cat)
                .map((skill, i) => {
                  const color = CATEGORY_COLORS[cat] || "orange";
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-white/80 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-white/30 text-sm">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                          viewport={{ once: true }}
                          className={`h-full rounded-full bg-gradient-to-r ${
                            color === "orange"
                              ? "from-orange-500 to-orange-300"
                              : color === "blue"
                              ? "from-blue-500 to-blue-300"
                              : "from-purple-500 to-purple-300"
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

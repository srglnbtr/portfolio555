"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { addMessage } from "@/lib/firestore";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await addMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-32 px-6 md:px-16 bg-[#0a0a0f]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-orange-400 mb-4">
            Get in touch
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Contact
          </h2>
          <p className="text-white/40">
            Хамтран ажиллах санал, асуулт байвал холбоо барина уу.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          {[
            { key: "name", label: "Нэр", type: "text", placeholder: "Таны нэр" },
            { key: "email", label: "И-мэйл", type: "email", placeholder: "email@example.com" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs uppercase tracking-widest text-white/30 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-400/50 focus:bg-white/8 transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/30 mb-2">
              Мессеж
            </label>
            <textarea
              rows={5}
              placeholder="Таны мессеж..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold uppercase tracking-widest text-sm hover:from-orange-400 hover:to-orange-300 transition-all disabled:opacity-50"
          >
            {status === "sending" ? "Илгээж байна..." : "Илгээх"}
          </button>

          {status === "sent" && (
            <p className="text-center text-green-400 text-sm">
              ✓ Мессеж амжилттай илгээгдлээ!
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-red-400 text-sm">
              Алдаа гарлаа. Дахин оролдоно уу.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

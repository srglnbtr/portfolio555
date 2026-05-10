"use client";
import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 60;
const FRAME_PATH = (i: number) =>
  `/sequence/frame_${String(i).padStart(2, "0")}.webp`;

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.55], [0, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.85], [0, 1, 0]);

  // Preload frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          framesRef.current = images;
          drawFrame(0);
        }
      };
      img.onerror = () => { loaded++; };
      images.push(img);
    }

    // Draw placeholder gradient while loading
    drawPlaceholder();
  }, []);

  function drawPlaceholder() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#0a0a0f");
    grad.addColorStop(1, "#1a0a2e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawFrame(index: number) {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = frames[index];
    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }

  // Subscribe to scroll
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        Math.floor(v * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        drawFrame(idx);
      }
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Parallax text overlays */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">

          {/* Section 1 — center */}
          <motion.div
            style={{ opacity: opacity1 }}
            className="absolute text-center px-8"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-orange-400 mb-4 font-light">
              Creative Developer
            </p>
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-none">
              Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
                Name.
              </span>
            </h1>
          </motion.div>

          {/* Section 2 — left */}
          <motion.div
            style={{ opacity: opacity2 }}
            className="absolute left-8 md:left-24 text-left px-4"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">
              What I do
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              I build<br />
              digital<br />
              <span className="text-orange-400">experiences.</span>
            </h2>
          </motion.div>

          {/* Section 3 — right */}
          <motion.div
            style={{ opacity: opacity3 }}
            className="absolute right-8 md:right-24 text-right px-4"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 mb-3">
              My approach
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Bridging<br />
              design &<br />
              <span className="text-blue-400">engineering.</span>
            </h2>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: opacity1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-white/50">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

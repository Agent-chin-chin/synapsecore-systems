'use client';
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];
    const PARTICLE_COUNT = 80;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="relative min-h-screen bg-black text-white flex items-center overflow-hidden"
      style={{ backgroundColor: "#070B14" }}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Interactive mouse-follow glow */}
      <motion.div
        className="pointer-events-none absolute h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(16,185,129,0.2) 50%, transparent 70%)",
          left: mousePos.x - 128,
          top: mousePos.y - 128,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.4 }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", color: "#67E8F9" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              AI Automation • Cybersecurity • Enterprise Solutions
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ color: "#FFFFFF" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Reduce Security Incidents by{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse">
                73%
              </span>{" "}
              with AI-Powered Defense
            </motion.h1>

            <motion.p
              className="text-lg leading-8 mb-8 max-w-2xl"
              style={{ color: "#CBD5E1" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              SynapseCore protects enterprises with intelligent automation, proactive cybersecurity, and battle-tested response protocols.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Link
                href="/contact"
                className="rounded-full bg-green-400 text-black font-bold px-8 py-3.5 transition hover:bg-green-300 shadow-lg shadow-green-500/20 text-center relative overflow-hidden group"
              >
                <span className="relative z-10">Get Free Security Audit</span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/services/cybersecurity"
                className="rounded-full border border-green-400/30 text-white px-8 py-3.5 transition hover:bg-green-400/10 text-center hover:border-green-400/50"
              >
                View Security Services
              </Link>
              <Link
                href="/learner/login"
                className="rounded-full border border-cyan-400/30 text-cyan-300 px-8 py-3.5 transition hover:bg-cyan-400/10 text-center font-medium hover:border-cyan-400/50"
              >
                Learner Portal →
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">24/7 monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-green-500/20 blur-3xl opacity-40 rounded-full"></div>
            <motion.div
              className="relative rounded-[32px] p-8"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="h-2 rounded-full mb-8"
                style={{ background: "linear-gradient(to right, #22D3EE, #6366F1, #22D3EE)" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />

              <motion.div
                className="rounded-3xl p-6 mb-6"
                style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
                whileHover={{ borderColor: "rgba(34,211,238,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-2" style={{ color: "#94A3B8" }}>Average Response Time</p>
                <h2 className="text-6xl font-bold" style={{ color: "#FFFFFF" }}>18min</h2>
                <p className="mt-3 text-slate-500">vs 4+ hours industry average</p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div
                  className="rounded-3xl p-6"
                  style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
                  whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <h3 className="font-bold text-lg mb-3" style={{ color: "#FFFFFF" }}>Threat Detection</h3>
                  <p style={{ color: "#94A3B8" }}>
                    99.2% threat detection accuracy with automated response.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-3xl p-6"
                  style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
                  whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <h3 className="font-bold text-lg mb-3" style={{ color: "#FFFFFF" }}>SLA Guarantee</h3>
                  <p style={{ color: "#94A3B8" }}>
                    99.9% uptime with 15-minute critical response.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

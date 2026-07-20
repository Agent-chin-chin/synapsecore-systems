'use client';
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Deployments", value: 120, max: 150 },
  { label: "Uptime", value: 99.99, suffix: "%", max: 100 },
  { label: "Clients Served", value: 45, max: 60 },
  { label: "Teams Trained", value: 18, max: 25 },
  { label: "Automation ROI", value: 34, suffix: "%", max: 50 },
];

export default function MetricsBar() {
  const [counts, setCounts] = useState(metrics.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const duration = 1200;
            const startTime = performance.now();
            const startValues = metrics.map(() => 0);

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);

              setCounts(
                metrics.map((metric) => {
                  const target = metric.value;
                  return Math.round(startValues[0] + (target - startValues[0]) * eased);
                })
              );

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCounts(metrics.map((metric) => metric.value));
              }
            };

            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.querySelector("#metrics");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="metrics" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_28px_80px_rgba(8,15,35,0.2)] backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated gradient border glow */}
          <div className="absolute inset-0 rounded-[2rem] opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-[2rem] border border-cyan-400/20" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 relative">
            {metrics.map((metric, index) => {
              const percentage = Math.min(100, Math.round((counts[index] / metric.max) * 100));
              const circumference = 2 * Math.PI * 40;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;

              return (
                <motion.div
                  key={metric.label}
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="relative h-24 w-24 mx-auto">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" strokeWidth="8" fill="none" className="text-white/10" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        strokeWidth="8"
                        fill="none"
                        stroke="currentColor"
                        className="text-cyan-400"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-lg font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        {counts[index]}{metric.suffix || ""}
                      </motion.span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 text-center">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

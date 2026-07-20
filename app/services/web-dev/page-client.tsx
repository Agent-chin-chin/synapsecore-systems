'use client';

import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function PageClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <motion.header
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-semibold">Website Development for Enterprises</h1>
            <p className="mt-4 text-slate-300 text-lg">
              Secure, maintainable, and performance-first web applications built to meet enterprise SLAs and compliance requirements.
            </p>
          </motion.header>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <motion.section
            className="grid gap-8 lg:grid-cols-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                What we deliver
              </motion.h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>Architecture & platform design for scalability and resilience.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>Secure development lifecycle, code reviews, and automated tests.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>Accessible, SEO-friendly front-ends and high-performance APIs.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>CI/CD pipelines, observability, and long-term support plans.</motion.li>
              </ul>

              <motion.h3
                className="mt-6 text-xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Approach
              </motion.h3>
              <motion.p
                className="mt-2 text-slate-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                We partner with product and security teams to design modular systems that interoperate with your existing services while enforcing security and governance controls.
              </motion.p>
            </div>

            <motion.aside
              className="rounded-2xl border border-white/10 bg-[#071026]/60 p-6 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10 transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-semibold text-cyan-300">Typical engagement</h4>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>1–2 week discovery and risk assessment</li>
                <li>4–12 week feature delivery sprints</li>
                <li>Production hardening and SOC handoff</li>
              </ul>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                  Request a Project Review
                </Link>
              </div>
            </motion.aside>
          </motion.section>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold">Security & compliance</h2>
            <p className="mt-4 text-slate-300">
              We bake security into each layer — secure coding standards, dependency hygiene, automated SCA scans, and configurable runtime policies aligned to common compliance frameworks.
            </p>
          </motion.section>
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <motion.section
            className="mt-12 rounded-2xl border border-white/10 bg-slate-900/60 p-8 hover:border-white/20 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl font-semibold">Ready to start?</h3>
            <p className="mt-3 text-slate-300">Contact our delivery team to discuss timelines, scope, and a tailored engagement plan.</p>
            <div className="mt-6">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                Contact Sales
              </Link>
            </div>
          </motion.section>
        </ScrollReveal>
      </div>
    </main>
  );
}

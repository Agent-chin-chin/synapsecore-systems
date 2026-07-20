'use client';

import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function AIAutomationPageClient() {
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
            <h1 className="text-4xl sm:text-5xl font-semibold">AI Automation</h1>
            <p className="mt-4 text-slate-300 text-lg">Intelligent automation that reduces manual work and accelerates enterprise decision-making.</p>
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
                Capabilities
              </motion.h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>Workflow automation for cross-functional teams.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>Smart decision engines with rules and AI orchestration.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>Data-driven process optimization and monitoring.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>Secure automation aligned with governance and compliance.
                </motion.li>
              </ul>

              <motion.h3
                className="mt-6 text-xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Why it matters
              </motion.h3>
              <motion.p
                className="mt-2 text-slate-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Automation improves velocity, reduces errors, and frees technical teams to focus on high-value innovation while maintaining enterprise controls.
              </motion.p>
            </div>

            <motion.aside
              className="rounded-2xl border border-white/10 bg-[#071026]/60 p-6 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10 transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-semibold text-cyan-300">Typical outcomes</h4>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>30% fewer manual process hours</li>
                <li>Higher operational predictability</li>
                <li>Faster incident response coordination</li>
              </ul>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                  Book an Automation Review
                </Link>
              </div>
            </motion.aside>
          </motion.section>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <motion.section
            className="mt-12 rounded-2xl border border-white/10 bg-slate-900/60 p-8 hover:border-white/20 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl font-semibold">Enterprise-grade automation</h3>
            <p className="mt-4 text-slate-300">We build automation platforms with secure connectors, observability, and governance layers that work with both cloud and on-premise systems.</p>
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
            <h3 className="text-xl font-semibold">Get started</h3>
            <p className="mt-3 text-slate-300">Talk with our team to identify the fastest automation wins for your organization.</p>
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

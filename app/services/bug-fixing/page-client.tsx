'use client';

import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function BugFixingPageClient() {
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
            <h1 className="text-4xl sm:text-5xl font-semibold">Bug Fixing & Support</h1>
            <p className="mt-4 text-slate-300 text-lg">Rapid root-cause analysis, prioritized remediation, and sustained platform health.</p>
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
                Our process
              </motion.h2>
              <ol className="mt-4 space-y-3 text-slate-300 list-decimal list-inside">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>Rapid intake and incident triage.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>Safe staging for reproducible testing.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>Code-level remediation and regression verification.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>Security patching and long-term recommendations.</motion.li>
              </ol>

              <motion.h3
                className="mt-6 text-xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                SLA & support
              </motion.h3>
              <motion.p
                className="mt-2 text-slate-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                We offer SLA-backed response times and optional managed support for continuous monitoring and proactive patching.
              </motion.p>
            </div>

            <motion.aside
              className="rounded-2xl border border-white/10 bg-[#071026]/60 p-6 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10 transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-semibold text-cyan-300">Incident engagements</h4>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>Emergency patching (minutes–hours)</li>
                <li>Root cause analysis (1–3 days)</li>
                <li>Maintenance contracts and retainer options</li>
              </ul>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                  Report an Incident
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
            <h2 className="text-2xl font-semibold">Security-focused fixes</h2>
            <p className="mt-4 text-slate-300">Our fixes prioritize safety and backward-compatibility with a focus on reducing attack surface and preventing regressions.</p>
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
            <h3 className="text-xl font-semibold">Start a support case</h3>
            <p className="mt-3 text-slate-300">Open a case and receive an initial triage within our SLA window.</p>
            <div className="mt-6">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                Open a Case
              </Link>
            </div>
          </motion.section>
        </ScrollReveal>
      </div>
    </main>
  );
}

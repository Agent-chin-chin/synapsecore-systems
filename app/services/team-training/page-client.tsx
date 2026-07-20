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
            <h1 className="text-4xl sm:text-5xl font-semibold">Team Training & Certification</h1>
            <p className="mt-4 text-slate-300 text-lg">Practical, role-based programs for engineers, security teams, and leadership.</p>
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
                Programs
              </motion.h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>Developer secure-coding workshops</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>SOC analyst accelerated learning</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>AI systems integration labs</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>Leadership briefings and risk governance training</motion.li>
              </ul>

              <motion.h3
                className="mt-6 text-xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Outcomes
              </motion.h3>
              <motion.p
                className="mt-2 text-slate-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Measurable improvements in mean time to detect/resolve incidents and stronger cross-team collaboration.
              </motion.p>
            </div>

            <motion.aside
              className="rounded-2xl border border-white/10 bg-[#071026]/60 p-6 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10 transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-semibold text-cyan-300">Delivery formats</h4>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>Onsite bootcamps</li>
                <li>Virtual instructor-led training</li>
                <li>Self-paced labs with assessment</li>
              </ul>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                  Schedule a Training Review
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
            <h2 className="text-2xl font-semibold">Certification</h2>
            <p className="mt-4 text-slate-300">Offer recognized certifications for practitioners within your organization to demonstrate capability and maintain standards.</p>
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
            <p className="mt-3 text-slate-300">Talk to our training team to map courses to roles and objectives.</p>
            <div className="mt-6">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                Contact Training Team
              </Link>
            </div>
          </motion.section>
        </ScrollReveal>
      </div>
    </main>
  );
}

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
            <h1 className="text-4xl sm:text-5xl font-semibold">Cybersecurity</h1>
            <p className="mt-4 text-slate-300 text-lg">Comprehensive security services to protect enterprise applications, data, and infrastructure.</p>
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
                What we protect
              </motion.h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>Cloud and on-premise environments.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>Web applications and APIs.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>Data platforms and integrations.</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>Endpoint and infrastructure security.
                </motion.li>
              </ul>

              <motion.h3
                className="mt-6 text-xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Security approach
              </motion.h3>
              <motion.p
                className="mt-2 text-slate-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                We combine proactive risk assessments, threat detection, and incident response playbooks to keep modern digital platforms defended and compliant.
              </motion.p>
            </div>

            <motion.aside
              className="rounded-2xl border border-white/10 bg-[#071026]/60 p-6 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/10 transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-semibold text-cyan-300">Featured services</h4>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>Threat detection & monitoring</li>
                <li>Security architecture reviews</li>
                <li>Vulnerability assessments</li>
              </ul>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                  Schedule a Security Review
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
            <h3 className="text-xl font-semibold">Managed defense</h3>
            <p className="mt-4 text-slate-300">Our security engagements prioritize business continuity and measurable risk reduction, so teams can operate with confidence.</p>
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
            <h3 className="text-xl font-semibold">Start a security program</h3>
            <p className="mt-3 text-slate-300">Connect with our team to scope a secure transformation path for your infrastructure and applications.</p>
            <div className="mt-6">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                Contact Security Team
              </Link>
            </div>
          </motion.section>
        </ScrollReveal>
      </div>
    </main>
  );
}

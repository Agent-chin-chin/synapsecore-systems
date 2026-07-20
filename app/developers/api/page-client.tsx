'use client'
import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function APIDocsPage() {
  return (
    <ScrollReveal>
      <div className="min-h-screen bg-[#070B14] text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.header
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-semibold">API Documentation</h1>
            <p className="mt-4 text-slate-300 text-lg">
              RESTful endpoints for incidents, tickets, status, and webhook management.
            </p>
          </motion.header>

          <section className="space-y-6">
            <ScrollReveal delay={0.2}>
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold">Base URL</h2>
                <motion.pre
                  className="mt-3 rounded-lg bg-black/40 p-4 text-sm text-green-400"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >https://api.synapsecoresystems.com/v1</motion.pre>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold">Authentication</h2>
                <p className="mt-2 text-slate-300 text-sm">Use Bearer tokens in the Authorization header.</p>
                <motion.pre
                  className="mt-3 rounded-lg bg-black/40 p-4 text-sm text-green-400"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >Authorization: Bearer YOUR_API_KEY</motion.pre>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold">Endpoints</h2>
                <ul className="mt-3 space-y-2 text-slate-300 text-sm">
                  <li><code className="text-green-400">GET /incidents</code> — List incidents</li>
                  <li><code className="text-green-400">POST /incidents</code> — Create incident</li>
                  <li><code className="text-green-400">GET /status</code> — System health</li>
                  <li><code className="text-green-400">POST /webhooks</code> — Register webhook</li>
                </ul>
              </motion.div>
            </ScrollReveal>
          </section>

          <ScrollReveal delay={0.6}>
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/developers/playground" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                Try API Playground
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}

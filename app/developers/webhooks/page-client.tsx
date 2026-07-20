'use client'
import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function WebhooksPage() {
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
            <h1 className="text-4xl font-semibold">Webhooks & Events</h1>
            <p className="mt-4 text-slate-300 text-lg">
              Real-time event notifications and callback configuration.
            </p>
          </motion.header>

          <ScrollReveal delay={0.2}>
            <motion.section
              className="grid gap-8 lg:grid-cols-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-xl font-semibold">Supported Events</h2>
                <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                  <li>incident.created</li>
                  <li>incident.updated</li>
                  <li>incident.resolved</li>
                  <li>threat.alert</li>
                  <li>system.status_changed</li>
                </ul>
              </motion.div>
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-xl font-semibold">Security</h2>
                <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                  <li>HMAC-SHA256 signatures</li>
                  <li>Retry logic with backoff</li>
                  <li>Event deduplication</li>
                </ul>
              </motion.div>
            </motion.section>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/contact" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors">
                Contact Support
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}

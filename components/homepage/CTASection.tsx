'use client';
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <motion.section
      className="rounded-[2rem] border border-green-400/30 bg-gray-900 py-16 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 border border-green-400/30 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-green-400">✓</span>
            <span className="text-sm font-semibold uppercase tracking-wider text-green-300">Trusted by 120+ Enterprises</span>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white mb-4 sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Secure Your Business in 48 Hours
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Get a free security assessment and custom roadmap. Limited availability for June onboarding.
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-green-400 px-8 py-3 text-sm font-bold text-black transition hover:bg-green-300 shadow-lg shadow-green-500/20 relative overflow-hidden group"
            >
              <span className="relative z-10">Claim Free Assessment →</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-green-400/30 px-8 py-3 text-sm font-medium text-white transition hover:bg-green-400/10 hover:border-green-400/50"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

'use client'
import Link from "next/link";
import { motion } from "framer-motion";

export default function PersonalizedDashboardPage() {
  return (
    <motion.div
      className="min-h-screen bg-[#070B14] text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-12">
          <motion.h1
            className="text-4xl font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Dashboard
          </motion.h1>
          <motion.p
            className="mt-4 text-slate-300 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tailored widgets, metrics, and alerts based on your environment and priorities.
          </motion.p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Incident Trends",
              body: "Track open, resolved, and escalated incidents over time.",
            },
            {
              title: "Response SLA",
              body: "Monitor adherence to response and resolution commitments.",
            },
            {
              title: "Threat Coverage",
              body: "See which assets, environments, and services are monitored.",
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 hover:-translate-y-1 hover:border-cyan-400/40 transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-slate-300 text-sm">{card.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-2xl font-semibold">Ready to Customize?</h2>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto">
            Log in to access your personalized dashboard with live data.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            Go to Login
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

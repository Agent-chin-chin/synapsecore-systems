'use client'
import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const integrations = [
  { name: "Slack", description: "Incident alerts and team notifications in Slack channels." },
  { name: "PagerDuty", description: "On-call escalation and incident management." },
  { name: "GitHub / GitLab", description: "Security scanning and PR comment automation." },
  { name: "Jira", description: "Auto-create tickets from security findings." },
  { name: "Splunk / ELK", description: "Ship logs and threat events to your SIEM." },
  { name: "AWS / GCP / Azure", description: "Cloud posture and workload security integrations." },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <ScrollReveal direction="up" delay={0}>
          <header className="mb-16 text-center">
            <motion.h1
              className="text-4xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Integrations
            </motion.h1>
            <motion.p
              className="mt-4 text-slate-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Connect SynapseCore with the tools your team already uses.
            </motion.p>
          </header>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                whileHover={{ y: -4, borderColor: "rgba(34, 211, 238, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-slate-300 text-sm">{item.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.3}>
          <motion.div
            className="mt-16 rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center"
            whileHover={{ scale: 1.01, borderColor: "rgba(34, 211, 238, 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold">Need a Custom Integration?</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto">
              Our engineering team can build connectors for internal tools, legacy systems, and proprietary platforms.
            </p>
            <Link href="/contact" className="mt-6 inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
              Contact Integrations Team
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}

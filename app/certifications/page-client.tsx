'use client'
import Link from "next/link";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const certifications = [
  {
    title: "ISO 27001",
    description: "Information security management standard.",
    status: "Certified",
  },
  {
    title: "SOC 2 Type II",
    description: "Trust services criteria for security, availability, and confidentiality.",
    status: "Certified",
  },
  {
    title: "PCI DSS",
    description: "Payment card industry data security standard compliance.",
    status: "Compliant",
  },
  {
    title: "GDPR",
    description: "Data protection and privacy compliance for EU operations.",
    status: "Compliant",
  },
  {
    title: "NIST CSF",
    description: "Cybersecurity framework aligned with risk management practices.",
    status: "Aligned",
  },
  {
    title: "OWASP Top 10",
    description: "Secure development lifecycle aligned with OWASP best practices.",
    status: "Certified",
  },
];

export default function CertificationsPage() {
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
              Certifications & Compliance
            </motion.h1>
            <motion.p
              className="mt-4 text-slate-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Our commitments to security, privacy, and operational excellence.
            </motion.p>
          </header>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
              <motion.div
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                whileHover={{ y: -4, borderColor: "rgba(34, 211, 238, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-sm font-semibold text-cyan-300">{item.status}</div>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
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
            <h2 className="text-2xl font-semibold">Need Compliance Documentation?</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto">
              We can provide attestation letters, audit summaries, and security questionnaires for procurement.
            </p>
            <Link href="/contact" className="mt-6 inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
              Request Documentation
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}

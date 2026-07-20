'use client'
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ResourceCenterPage() {
  const cards = [
    {
      href: "/resources/whitepapers",
      emoji: "📄",
      title: "Whitepapers",
      description: "In-depth technical guides on security vulnerabilities, best practices, and case studies.",
      items: ["Zero-Day Vulnerability Trends 2026", "API Security Best Practices", "Database Protection & Compliance", "Incident Response Playbook"],
      cta: "Download →",
      color: "green"
    },
    {
      href: "/resources/ebooks",
      emoji: "📚",
      title: "eBooks",
      description: "Complete guides for developers and IT professionals to secure their applications.",
      items: ["Web App Security Handbook", "DevOps Security Guide", "Bug Bounty Masterclass", "Malware Analysis 101"],
      cta: "Download →",
      color: "green"
    },
    {
      href: "/resources/webinars",
      emoji: "🎥",
      title: "Webinars",
      description: "Live sessions with security experts discussing real-world vulnerabilities and fixes.",
      items: ["Live Penetration Testing Demo", "Q&A: Security Compliance", "Advanced Debugging Techniques", "Container Security Essentials"],
      cta: "Watch →",
      color: "green"
    },
    {
      href: "/resources/tutorials",
      emoji: "🎓",
      title: "Video Tutorials",
      description: "Step-by-step video guides for common security tasks and troubleshooting.",
      items: ["Setting Up SSL Certificates", "Configuring Firewalls", "Database Backup Automation", "API Security Testing"],
      cta: "Watch →",
      color: "green"
    },
    {
      href: "/developers/api",
      emoji: "📖",
      title: "Documentation",
      description: "Complete API documentation and technical reference guides for developers.",
      items: ["API Reference", "SDK Documentation", "Integration Guides", "Troubleshooting Guide"],
      cta: "Explore →",
      color: "green"
    },
    {
      href: "/blog",
      emoji: "✍️",
      title: "Blog",
      description: "Latest news, tips, and insights on cybersecurity and software development.",
      items: ["Latest Security News", "Developer Tips & Tricks", "Case Studies", "Industry Insights"],
      cta: "Read →",
      color: "green"
    }
  ];

  return (
    <ScrollReveal>
      <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
              Resource Center
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Learn, grow, and master cybersecurity best practices with our comprehensive resources.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {cards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={card.href}
                    className="block bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors h-full"
                  >
                    <div className="text-4xl mb-4">{card.emoji}</div>
                    <h2 className="text-2xl font-bold text-green-400 mb-4">{card.title}</h2>
                    <p className="text-gray-300 mb-6">
                      {card.description}
                    </p>
                    <ul className="space-y-2 text-gray-300 text-sm mb-6">
                      {card.items.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                        >
                          <span className="text-green-400">→</span> {item}
                        </motion.li>
                      ))}
                    </ul>
                    <span className="text-green-400 hover:text-green-300 font-semibold">{card.cta}</span>
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.6}>
            <motion.div
              className="bg-gray-800 rounded-lg p-12 border border-green-400/30 text-center hover:border-green-400/60 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                Can&apos;t find what you need?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our team is ready to create custom training materials and resources tailored to your organization&apos;s needs.
              </p>
              <a href="/contact" className="inline-flex items-center px-8 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors">
                Request Custom Resources
              </a>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}

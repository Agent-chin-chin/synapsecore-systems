'use client'
'use client';

import Link from 'next/link';
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function DevelopersPage() {
  const cards = [
    { href: "/developers/api", emoji: "🔌", title: "API Documentation", description: "Complete REST API reference with code examples, authentication, rate limits, and error handling.", items: ["RESTful endpoints", "Authentication & OAuth", "Rate limiting & quotas", "Response formats"], cta: "Explore API →" },
    { href: "/developers/webhooks", emoji: "⚡", title: "Webhooks & Events", description: "Real-time event notifications and callbacks for security incidents, system alerts, and updates.", items: ["Real-time events", "Event subscriptions", "Retry mechanisms", "Event signing"], cta: "Learn Webhooks →" },
    { href: "/developers/code-examples", emoji: "📦", title: "SDKs & Libraries", description: "Official client libraries for JavaScript, Python, Go, Java, and more to accelerate development.", items: ["JavaScript/TypeScript", "Python", "Go & Rust", "Java & .NET"], cta: "View SDKs →" },
    { href: "/integrations", emoji: "🔗", title: "Integrations", description: "Pre-built connectors for popular tools and platforms like Slack, GitHub, Jira, and more.", items: ["Slack integration", "GitHub & GitLab", "Jira & Azure DevOps", "AWS & GCP"], cta: "Browse Integrations →" },
    { href: "/developers/code-examples", emoji: "💻", title: "Code Examples", description: "Ready-to-use code snippets and sample projects to get you started quickly.", items: ["Authentication examples", "API request samples", "Error handling", "Best practices"], cta: "View Examples →" },
    { href: "/developers/status", emoji: "📊", title: "Status & Support", description: "Check system status, submit tickets, and get help from our developer support team.", items: ["System status", "Support tickets", "Community forum", "Changelog"], cta: "Get Support →" }
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
              Developer Portal
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Integrate SynapseCore&apos;s powerful cybersecurity APIs and tools into your applications. Build secure, scalable solutions.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {cards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={card.href}
                    className="block bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors group h-full"
                  >
                    <div className="text-4xl mb-4">{card.emoji}</div>
                    <h3 className="text-2xl font-bold text-green-400 group-hover:text-green-300 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {card.description}
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm mb-6">
                      {card.items.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                        >
                          ✓ {item}
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
              className="bg-gray-800 rounded-lg p-12 border border-green-400/30 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <motion.h2
                    className="text-3xl font-bold text-green-400 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Getting Started
                  </motion.h2>
                  <p className="text-gray-300 mb-6">
                    New to SynapseCore? Follow our step-by-step guide to set up your first integration.
                  </p>
                  <ol className="space-y-3 text-gray-300 mb-6">
                    {['Create a developer account', 'Generate API keys', 'Read the API documentation', 'Build your first request'].map((step, idx) => (
                      <motion.li
                        key={idx}
                        className="flex gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                      >
                        <span className="text-green-400 font-bold">{idx + 1}.</span> <span>{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                  <Link href="/developers/getting-started" className="text-green-400 hover:text-green-300 font-semibold">
                    Start Building →
                  </Link>
                </div>
                <div>
                  <motion.h2
                    className="text-3xl font-bold text-green-400 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    API Playground
                  </motion.h2>
                  <p className="text-gray-300 mb-6">
                    Try our interactive API explorer to test endpoints and see live responses before integrating.
                  </p>
                  <motion.div
                    className="bg-gray-900 border border-green-400/20 rounded p-4 font-mono text-sm text-green-400 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <p>$ curl https://api.synapsecore.com/v1/</p>
                    <p>  -H &quot;Authorization: Bearer YOUR_API_KEY&quot;</p>
                    <p>  -X GET</p>
                  </motion.div>
                  <Link href="/developers/playground" className="text-green-400 hover:text-green-300 font-semibold">
                    Try API Playground →
                  </Link>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-green-400 mb-4">Need Help with Integration?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our developer relations team is here to help you build amazing integrations.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Developer Support
              </motion.a>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}

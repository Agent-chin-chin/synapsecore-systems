'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function GettingStartedPageClient() {
  const steps = [
    { num: 1, title: 'Sign Up', desc: 'Create your developer account' },
    { num: 2, title: 'Get API Key', desc: 'Generate your API credentials' },
    { num: 3, title: 'Read Docs', desc: 'Explore our API documentation' },
    { num: 4, title: 'Build', desc: 'Integrate into your application' }
  ];

  return (
    <ScrollReveal>
      <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4">Getting Started</h1>
            <p className="text-gray-300 mb-12">Start building with SynapseCore in 4 easy steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.15}>
                <motion.div
                  className="bg-gray-800 border border-green-400/30 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="text-4xl font-bold text-green-400 mb-4">{step.num}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

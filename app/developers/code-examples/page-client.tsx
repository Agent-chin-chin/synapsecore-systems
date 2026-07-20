'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function CodeExamplesPageClient() {
  const examples = [
    {
      title: 'Authentication with API Key',
      language: 'JavaScript',
      code: 'const response = await fetch("https://api.synapsecoresystems.com/v1/incidents", { method: "GET", headers: { "Authorization": "Bearer YOUR_API_KEY" } });'
    },
    {
      title: 'Create Support Ticket',
      language: 'Python',
      code: 'import requests\napi_key = "your_api_key"\nresponse = requests.post("https://api.synapsecoresystems.com/v1/tickets", headers={"Authorization": f"Bearer {api_key}"})'
    }
  ];

  return (
    <ScrollReveal>
      <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4">Code Examples</h1>
            <p className="text-gray-300 mb-12">Ready-to-use snippets for common tasks.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {examples.map((ex, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="bg-gray-800 border border-green-400/30 rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-green-400">{ex.title}</h3>
                    <span className="text-xs bg-green-400/20 text-green-400 px-3 py-1 rounded">{ex.language}</span>
                  </div>
                  <motion.pre
                    className="bg-gray-900 p-4 rounded text-gray-300 text-sm overflow-x-auto"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {ex.code}
                  </motion.pre>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

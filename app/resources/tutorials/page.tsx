'use client'
'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function TutorialsPage() {
  const tutorials = [
    { title: 'Getting Started', duration: '10 min', category: 'Basics' },
    { title: 'API Integration', duration: '25 min', category: 'Advanced' },
    { title: 'Best Practices', duration: '15 min', category: 'Security' }
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
            <h1 className="text-4xl font-bold text-green-400 mb-4">Video Tutorials</h1>
            <p className="text-gray-300 mb-12">Step-by-step video guides to master SynapseCore.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {tutorials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="bg-gray-800 border border-green-400/30 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="bg-gray-900 aspect-video flex items-center justify-center text-4xl">▶</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-2">{t.title}</h3>
                    <p className="text-gray-400 text-sm">{t.duration} • {t.category}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

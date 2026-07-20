'use client'
'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function WebinarsPage() {
  const webinars = [
    { date: '2026-07-22', title: 'Live Pentest Demo', speaker: 'Ahmed Mohammed', type: 'Live' },
    { date: '2026-07-29', title: 'Security Q&A', speaker: 'Chioma Okafor', type: 'Live' },
    { date: '2026-08-05', title: 'Debugging Techniques', speaker: 'David Chen', type: 'Recording' }
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
            <h1 className="text-4xl font-bold text-green-400 mb-4">Webinars</h1>
            <p className="text-gray-300 mb-12">Live sessions and recordings with industry experts.</p>
          </motion.div>

          <div className="space-y-6">
            {webinars.map((w, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="bg-gray-800 border border-green-400/30 rounded-lg p-8 hover:border-green-400/60 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-400/20 text-red-400">
                        {w.type === 'Live' ? '🔴 LIVE' : '📹 RECORDING'}
                      </span>
                      <h3 className="text-2xl font-bold text-green-400 mt-2">{w.title}</h3>
                      <p className="text-gray-400 text-sm mt-2">Speaker: {w.speaker}</p>
                    </div>
                    <motion.button
                      className="px-6 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {w.type === 'Live' ? 'Register' : 'Watch'}
                    </motion.button>
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

'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function StatusPageClient() {
  const services = [
    { name: 'API', status: 'Operational', uptime: '99.99%' },
    { name: 'Platform', status: 'Operational', uptime: '99.95%' },
    { name: 'Dashboard', status: 'Operational', uptime: '99.98%' }
  ];

  return (
    <ScrollReveal>
      <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4">System Status</h1>
            <p className="text-gray-300 mb-12">All systems operational</p>
          </motion.div>

          <div className="space-y-4">
            {services.map((svc, i) => (
              <ScrollReveal key={svc.name} delay={i * 0.15}>
                <motion.div
                  className="bg-gray-800 border border-green-400/30 rounded-lg p-6 flex justify-between items-center hover:border-green-400/60 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{svc.name}</h3>
                    <p className="text-green-400 text-sm">Uptime: {svc.uptime}</p>
                  </div>
                  <span className="px-4 py-2 bg-green-400/20 text-green-400 rounded font-bold">{svc.status}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

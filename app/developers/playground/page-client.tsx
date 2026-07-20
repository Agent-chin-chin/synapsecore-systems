'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function PlaygroundPageClient() {
  return (
    <ScrollReveal>
      <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4">API Playground</h1>
            <p className="text-gray-300 mb-12">Test API endpoints in real-time.</p>
          </motion.div>

          <ScrollReveal delay={0.2}>
            <motion.div
              className="bg-gray-800 border border-green-400/30 rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <label className="block text-green-400 font-bold mb-2">Select Endpoint</label>
                  <div className="w-full bg-gray-900 border border-green-400/30 text-white px-4 py-2 rounded">
                    <option>GET /incidents</option>
                    <option>POST /tickets</option>
                    <option>GET /status</option>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label className="block text-green-400 font-bold mb-2">API Key</label>
                  <motion.input
                    type="password"
                    className="w-full bg-gray-900 border border-green-400/30 text-white px-4 py-2 rounded"
                    placeholder="Your API Key"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>
                <motion.button
                  className="w-full px-6 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Execute
                </motion.button>
              </div>
              <motion.pre
                className="mt-6 bg-gray-900 p-4 rounded text-green-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Response will appear here...
              </motion.pre>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}

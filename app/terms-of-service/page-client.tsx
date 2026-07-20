'use client';

import { motion } from 'framer-motion';

export default function TermsOfServicePageClient() {
  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] py-20 bg-gray-900"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Terms of Service
        </motion.h1>
        <motion.div
          className="prose prose-invert max-w-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-300">
            These terms govern your use of SynapseCore services. By accessing or using our platform, you agree to these terms.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

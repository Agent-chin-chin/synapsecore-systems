'use client';

import { motion } from 'framer-motion';
import Testimonials from '@/components/homepage/Testimonials';

export default function TestimonialsPageClient() {
  return (
    <motion.div
      className="min-h-[calc(100vh-64px)] py-20 bg-gray-900"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-center text-white mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Testimonials
        </motion.h1>
        <Testimonials />
      </div>
    </motion.div>
  );
}

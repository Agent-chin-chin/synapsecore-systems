'use client'
import { motion } from 'framer-motion';
import ThreatFeedTable from '@/components/admin/threat-feed-table';

export default function AdminThreatFeedPage() {
  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Threat Feed
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ThreatFeedTable />
      </motion.div>
    </motion.div>
  );
}

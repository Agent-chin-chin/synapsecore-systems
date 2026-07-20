'use client'
import { motion } from 'framer-motion';
import ReportManager from '@/components/admin/report-manager';

export default function AdminReportsPage() {
  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold mb-4">Admin Reports</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Generate operational reports and export them as CSV or PDF for admin review.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ReportManager />
      </motion.div>
    </motion.div>
  );
}

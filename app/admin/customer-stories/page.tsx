'use client'
import { motion } from 'framer-motion';
import CustomerStoryTable from '@/components/admin/customer-story-table';

export default function AdminCustomerStoriesPage() {
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
        Customer Stories
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CustomerStoryTable />
      </motion.div>
    </motion.div>
  );
}

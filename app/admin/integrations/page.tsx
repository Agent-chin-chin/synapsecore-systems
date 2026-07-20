'use client'
import { motion } from 'framer-motion';
import IntegrationTable from '@/components/admin/integration-table';

export default function AdminIntegrationsPage() {
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
        Integrations
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <IntegrationTable />
      </motion.div>
    </motion.div>
  );
}

'use client'
'use client';

import { motion } from 'framer-motion';
import AuditLogTable from '@/components/admin/audit-log-table';

export default function AuditLogsPage() {
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
        Audit Logs
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AuditLogTable />
      </motion.div>
    </motion.div>
  );
}

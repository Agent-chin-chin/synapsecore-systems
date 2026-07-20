'use client'
import { motion } from 'framer-motion';
import RoleManager from '@/components/admin/role-manager';

export default function RoleManagementPage() {
  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold mb-2">Role Management</h1>
        <p className="text-slate-400">Create, edit, and remove admin roles and permission sets.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <RoleManager />
      </motion.div>
    </motion.div>
  );
}

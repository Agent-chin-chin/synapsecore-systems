'use client'
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p>Redirecting to dashboard...</p>
    </motion.div>
  );
}

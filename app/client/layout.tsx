'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ClientSidebar from '@/components/client/sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <ClientSidebar
          className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 transform border-r border-slate-800 bg-slate-900 transition-transform duration-300 ease-in-out xl:static xl:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        />

        <div className="flex-1">
          <div className="sticky top-0 z-20 border-b border-gray-200 bg-gray-50 px-4 py-4 backdrop-blur-md md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 xl:hidden hover:border-blue-400 hover:text-blue-600 transition-all hover:scale-105"
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-blue-500">Client Portal</p>
                  <h1 className="text-xl font-semibold text-gray-900">SynapseCore Systems</h1>
                </div>
              </div>
              <div className="text-sm text-gray-500">Manage your incidents and support requests.</div>
            </div>
          </div>

          <motion.main
            className="px-4 py-6 md:px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

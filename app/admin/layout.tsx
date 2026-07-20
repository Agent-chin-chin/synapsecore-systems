'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <div
          className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 xl:static xl:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <Sidebar className="h-full w-full border-r border-slate-800 bg-slate-900" />
        </div>

        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/70 xl:hidden"
          />
        ) : null}

        <div className="flex-1">
          <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur-md md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 xl:hidden hover:border-cyan-400/30 hover:text-cyan-300 transition-all"
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-400">Admin Console</p>
                  <h1 className="text-xl font-semibold text-white">SynapseCore Systems</h1>
                </div>
              </div>
              <div className="text-sm text-slate-400">Manage operations, support, and incident workflows.</div>
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

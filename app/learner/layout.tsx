'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import LearnerSidebar from '@/components/learner/sidebar';
import { ToastProvider } from '@/components/toast-provider';

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen">
        {/* Sidebar - Hidden on mobile, visible on xl */}
        <LearnerSidebar
          className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 transform border-r border-slate-800 bg-slate-900 transition-transform duration-300 ease-in-out xl:static xl:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        />

        <div className="flex-1">
          {/* Top header with toggle button */}
          <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur-md md:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile menu toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white xl:hidden hover:scale-110"
                  aria-label="Toggle sidebar"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-400">Learning Academy</p>
                  <h1 className="text-xl font-semibold text-white">SynapseCore Cybersecurity</h1>
                </div>
              </div>
              <div className="text-sm text-slate-400">Learn, practice, and master cybersecurity skills.</div>
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
    </ToastProvider>
  );
}

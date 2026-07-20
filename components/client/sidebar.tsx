'use client';

import Link from 'next/link';
import { useState } from 'react';

const navGroups = [
  {
    title: 'Main',
    items: [
      { href: '/client/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/client/incidents', label: 'Incidents', icon: '⚠️' },
      { href: '/client/bookings', label: 'Bookings', icon: '📅' },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/client/profile', label: 'Profile', icon: '👤' },
    ],
  },
];

export default function ClientSidebar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`${className} flex min-h-screen flex-col bg-slate-950 text-slate-100 border-r border-slate-800 transform transition-transform duration-200 xl:static xl:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-500 text-lg font-semibold text-slate-950">
            C
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">SynapseCore</p>
            <p className="text-xs text-slate-500">Client Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {group.title}
              </p>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900 text-slate-300">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 px-6 py-5 text-xs text-slate-500">
          <p>Client Portal</p>
          <p className="mt-2 text-slate-400">Security Operations</p>
        </div>
      </aside>
    </>
  );
}

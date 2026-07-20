'use client'
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/support', { credentials: 'include' });
      if (!response.ok) throw new Error('Unable to load support tickets');
      const payload = await response.json();
      setTickets(payload?.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const updateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    try {
      const response = await fetch(`/api/support/${ticketId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Unable to update ticket');
      await loadTickets();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to update ticket');
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Operations</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Support Tickets</h1>
            <p className="mt-2 text-sm text-slate-400">Review incoming issues, assign urgent work, and keep learner and client communication moving.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
            {tickets.filter((ticket) => ticket.status === 'open').length} open tickets
          </div>
        </div>
      </motion.div>

      {error ? (
        <motion.div
          className="rounded-3xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {error}
        </motion.div>
      ) : null}

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">No support tickets available right now.</div>
        ) : (
          tickets.map((ticket, idx) => (
            <motion.div
              key={ticket._id}
              className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-sm hover:border-cyan-500/40 transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{ticket.subject}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' : ticket.priority === 'medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>{ticket.priority}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : ticket.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-300'
                    }`}>{ticket.status}</span>
                  </div>
                  <p className="text-sm text-slate-400">From {ticket.name} • {ticket.email}</p>
                  <p className="text-sm text-slate-300">{ticket.message}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <motion.button
                    type="button"
                    onClick={() => updateTicket(ticket._id, { status: 'in-progress' })}
                    className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Mark in progress
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => updateTicket(ticket._id, { status: 'resolved' })}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Resolve
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

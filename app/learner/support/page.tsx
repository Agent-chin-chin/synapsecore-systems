'use client'
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/support', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTickets(data.data?.tickets || data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      const meData = meRes.ok ? await meRes.json() : {};
      const userName = meData?.data?.fullname || '';
      const userEmail = meData?.data?.email || '';

      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: userName, email: userEmail, subject, description, priority: 'medium' })
      });

      if (response.ok) {
        setSubject('');
        setDescription('');
        setShowForm(false);
        await fetchTickets();
      } else {
        const body = await response.json();
        console.error('Support ticket error:', body);
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    open: 'bg-blue-900 text-blue-200',
    'in-progress': 'bg-yellow-900 text-yellow-200',
    resolved: 'bg-green-900 text-green-200',
    closed: 'bg-gray-900 text-gray-200'
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-slate-800 text-slate-200',
    medium: 'bg-orange-900 text-orange-200',
    high: 'bg-red-900 text-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Support Tickets</h1>
            <p className="mt-2 text-slate-400">Get help with your learning journey</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-500"
            >
              New Ticket
            </button>
          </motion.div>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6"
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold text-white">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-white">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                placeholder="Detailed description of your issue"
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-cyan-600 px-6 py-2 font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-600 px-6 py-2 font-semibold text-white transition hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-12 text-center">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="text-xl font-semibold text-white">No support tickets</h3>
            <p className="mt-2 text-slate-400">Submit a ticket if you need help</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition hover:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{ticket.subject}</h3>
                    <p className="mt-2 text-slate-400">{ticket.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                  <span className="ml-auto text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

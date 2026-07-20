'use client';

import { useState } from 'react';
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function NewsletterPageClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Subscription failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#070B14] px-6">
      <ScrollReveal direction="up" delay={0}>
        <motion.div
          className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/60 p-8"
          whileHover={{ scale: 1.01, borderColor: "rgba(34, 211, 238, 0.3)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-3xl font-semibold text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Stay Ahead of Threats
          </motion.h1>
          <motion.p
            className="mt-3 text-slate-300 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Weekly cybersecurity insights, product updates, and actionable security guidance.
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-200">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              placeholder="you@company.com"
            />
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
            {status === 'success' && (
              <p className="text-sm text-green-400 text-center">You&apos;re subscribed. Welcome aboard.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400 text-center">Something went wrong. Please try again.</p>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            No spam. Unsubscribe anytime. Read our Privacy Policy.
          </p>
        </motion.div>
      </ScrollReveal>
    </div>
  );
}

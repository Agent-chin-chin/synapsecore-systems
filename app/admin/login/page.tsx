'use client'
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      const adminRoles = ['Super Admin', 'Support Engineer', 'admin'];
      if (!data.data || !adminRoles.includes(data.data.role)) {
        throw new Error('Admin access denied.');
      }

      setSuccess('Login successful! Redirecting...');
      const redirectTo = data.redirect || '/admin/dashboard';
      window.location.assign(redirectTo);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_30%)]" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500 text-2xl font-semibold text-slate-950 shadow-xl shadow-cyan-500/20">
              SC
            </div>
            <h1 className="text-3xl font-semibold text-white">Admin Login</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Secure access for the SynapseCore admin console.
            </p>
           </motion.div>

           {error && (
            <motion.div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {success}
            </motion.div>
          )}

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500" />
                Remember me
              </label>
              <a href="#" className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </motion.form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need help?{' '}
            <a href="/contact" className="font-medium text-cyan-400 hover:text-cyan-300">
              Contact support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

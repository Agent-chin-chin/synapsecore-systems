'use client'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/learner/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to request password reset');
      }

      setMessage('If that email exists, a reset code has been sent. Check your inbox.');
      setTimeout(() => {
        router.push(`/learner/reset-password?email=${encodeURIComponent(email)}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">Forgot Password</h1>
          <p className="text-gray-400 mb-6">
            Enter your email and we’ll send you a code to reset your password.
          </p>
        </motion.div>

        {error && <motion.div className="mb-4 bg-red-900 border border-red-500 rounded-lg p-4 text-red-200" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{error}</motion.div>}
        {message && <motion.div className="mb-4 bg-green-900 border border-green-500 rounded-lg p-4 text-green-200" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{message}</motion.div>}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-cyan-500 py-3 text-black font-semibold transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Sending...' : 'Send reset code'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

'use client'
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data.data?.role) {
        throw new Error('Invalid login response');
      }

      const redirectTarget = ['Super Admin', 'Support Engineer', 'admin'].includes(data.data.role)
        ? '/admin/dashboard'
        : '/learner/dashboard';

      router.push(redirectTarget);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-center text-2xl font-bold text-gray-900">Sign in to SynapseCore</h2>
          <p className="text-center text-gray-600">Enter your credentials to continue.</p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>
          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

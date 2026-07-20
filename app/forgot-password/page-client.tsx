'use client';

import { useState } from 'react';

export default function ForgotPasswordPageClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">Reset your password</h2>
          <p className="text-center text-gray-600">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        {status === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            If an account exists, a reset link has been sent.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Something went wrong. Please try again.
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
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
            <button
              type="submit"
              disabled={status === 'loading'}
              className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
          <div className="text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">Back to login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client'
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/learner/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Verification failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/learner/login');
      }, 2000);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendLoading(true);

    try {
      const response = await fetch('/api/learner/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Resend failed');
        return;
      }

      setResendCooldown(60);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md"
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
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Verify Your Email</h1>
          <p className="text-gray-400">We've sent a verification code to {email}</p>
        </motion.div>

        {success && (
          <motion.div className="mb-6 p-4 bg-green-900 border border-green-400 rounded-lg text-green-400" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            Email verified successfully! Redirecting to login...
          </motion.div>
        )}

        {error && (
          <motion.div className="mb-6 p-4 bg-red-900 border border-red-400 rounded-lg text-red-400" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleVerify}
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 transition text-center text-2xl tracking-widest"
              placeholder="000000"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || code.length !== 6}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </motion.button>
        </motion.form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-4">
            Didn't receive the code?
          </p>
          <motion.button
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-green-400 hover:underline disabled:text-gray-500"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

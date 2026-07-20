'use client'
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast-provider';
import { motion } from 'framer-motion';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/learner/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || 'Login failed';
        setErrors({ submit: msg });
        addToast('error', msg);
        // If login failed due to unverified email, show verify prompt
        if (response.status === 403 && /verify|not verified/i.test(msg)) {
          setShowVerifyPrompt(true);
        }
        return;
      }

      addToast('success', 'Login successful! Redirecting...');
      router.push('/learner/dashboard');
    } catch (error) {
      const errorMsg = 'An error occurred. Please try again.';
      setErrors({ submit: errorMsg });
      addToast('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  async function handleResendVerification() {
    setResendLoading(true);
    try {
      const res = await fetch('/api/learner/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const json = await res.json();
      if (!res.ok) {
        addToast('error', json.message || 'Failed to resend verification code');
      } else {
        addToast('success', json.message || 'Verification code resent');
      }
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  }

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
          <h1 className="text-3xl font-bold text-green-400 mb-2">Welcome Back</h1>
          <p className="text-gray-400">Continue your cybersecurity learning</p>
        </motion.div>

        {errors.submit && (
          <motion.div
            className="mb-6 p-4 bg-red-900 border border-red-400 rounded-lg text-red-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errors.submit}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:border-green-400 transition ${
                errors.email ? 'border-red-400' : 'border-gray-700'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:border-green-400 transition ${
                errors.password ? 'border-red-400' : 'border-gray-700'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 accent-green-400"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <Link href="/learner/forgot-password" className="text-green-400 hover:underline text-sm">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </motion.form>

        {showVerifyPrompt && (
          <div className="mt-6 p-4 rounded-lg bg-yellow-900 border border-yellow-400 text-yellow-200">
            <p className="mb-3">Your email address appears to be unverified. Please verify your email to continue.</p>
            <div className="flex gap-3">
              <Link
                href={`/learner/verify-email?email=${encodeURIComponent(formData.email)}`}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Verify Email
              </Link>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="rounded bg-transparent border border-yellow-400 px-4 py-2 text-yellow-200 hover:bg-yellow-800"
              >
                {resendLoading ? 'Resending...' : 'Resend verification code'}
              </button>
            </div>
            {resendMessage && <p className="mt-3 text-sm">{resendMessage}</p>}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/learner/register" className="text-green-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

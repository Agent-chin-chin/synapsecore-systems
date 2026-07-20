'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast-provider';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    learningGoal: '',
    country: 'Nigeria',
    state: '',
    dataProcessingConsent: false,
    termsConsent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast('warning', 'Please complete the required account information.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('error', 'Passwords do not match.');
      return;
    }

    if (!formData.termsConsent || !formData.dataProcessingConsent) {
      addToast('warning', 'Please accept the terms and privacy policy to continue.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/learner/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        addToast('error', data.message || 'Registration failed');
        return;
      }

      addToast('success', 'Welcome aboard! Your learner account is ready.');
      router.push('/learner/dashboard');
    } catch {
      addToast('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50';
  const labelClass = 'mb-2 block text-sm font-medium text-slate-300';

  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              SynapseCore Systems
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Create your learning account</h1>
            <p className="mt-3 text-base text-slate-400">Start learning in-demand technology skills with a simple, friction-free setup.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label className={labelClass}>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} required minLength={6} />
            </div>
            <div>
              <label className={labelClass}>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} required minLength={6} />
            </div>
            <div>
              <label className={labelClass}>Learning Goal</label>
              <select name="learningGoal" value={formData.learningGoal} onChange={handleChange} className={inputClass}>
                <option value="">Select an option</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="Networking">Networking</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className={inputClass}>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="Optional" />
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            <label className="flex items-start gap-3">
              <input type="checkbox" name="termsConsent" checked={formData.termsConsent} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900" />
              <span>I agree to the Terms &amp; Conditions.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="dataProcessingConsent" checked={formData.dataProcessingConsent} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900" />
              <span>I agree to the Privacy Policy.</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="mt-8 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <a href="/learner/login" className="font-semibold text-cyan-400 hover:text-cyan-300">Login</a>
          </p>
        </motion.form>

        <motion.div
          className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-white">Why join SynapseCore Academy?</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            {[
              'Learn at your own pace',
              'Hands-on practical courses',
              'Download learning resources',
              'Track your progress',
              'Earn certificates (Coming Soon)',
              'Learn from industry experts',
              'Secure online payments',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-cyan-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
            <p className="font-semibold text-cyan-300">Version 1.0</p>
            <p className="mt-2">We are launching with a simple learner experience and a clear roadmap for upcoming features.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

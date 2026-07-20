'use client'
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc';
  enabled: boolean;
  config: Record<string, string>;
  domains: string[];
}

export default function SSOPage() {
  const [providers, setProviders] = useState<SSOProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'saml' as 'saml' | 'oauth' | 'oidc', domains: '', issuer: '', callback: '' });

  useEffect(() => {
    void fetchProviders();
  }, []);

  async function fetchProviders() {
    try {
      setLoading(true);
      const res = await fetch('/api/sso', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch SSO providers');
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load SSO providers');
    } finally {
      setLoading(false);
    }
  }

  async function toggleProvider(id: string, enabled: boolean) {
    try {
      const res = await fetch(`/api/sso/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error('Failed to toggle provider');
      await fetchProviders();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to toggle provider');
    }
  }

  async function handleAddProvider(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/sso', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          domains: form.domains.split(',').map((value) => value.trim()).filter(Boolean),
          config: {
            issuer: form.issuer,
            callbackUrl: form.callback,
          },
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to create provider');

      setForm({ name: '', type: 'saml', domains: '', issuer: '', callback: '' });
      setShowAddForm(false);
      await fetchProviders();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create provider');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-8 text-white">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 p-8 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div>
          <h1 className="mb-2 text-3xl font-bold">SSO / SAML Integration</h1>
          <p className="text-slate-400">Configure enterprise authentication options here.</p>
        </div>
        <motion.button
          type="button"
          onClick={() => setShowAddForm((value) => !value)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-500"
        >
          + Add Provider
        </motion.button>
      </motion.div>

      {error ? <motion.div className="rounded-lg bg-red-900/70 px-4 py-3 text-red-100" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{error}</motion.div> : null}

      {showAddForm ? (
        <motion.form onSubmit={handleAddProvider} className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-400">Provider name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-400">Type</span>
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value as SSOProvider['type'] })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              >
                <option value="saml">SAML</option>
                <option value="oauth">OAuth</option>
                <option value="oidc">OIDC</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm text-slate-400">Accepted domains</span>
              <input
                value={form.domains}
                onChange={(event) => setForm({ ...form, domains: event.target.value })}
                placeholder="example.com, acme.org"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-400">Issuer URL</span>
              <input
                value={form.issuer}
                onChange={(event) => setForm({ ...form, issuer: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-400">Callback URL</span>
              <input
                value={form.callback}
                onChange={(event) => setForm({ ...form, callback: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save provider'}
            </motion.button>
            <motion.button type="button" onClick={() => setShowAddForm(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
              Cancel
            </motion.button>
          </div>
        </motion.form>
      ) : null}

      <div className="space-y-4">
        {providers.map((provider, index) => (
          <motion.div key={provider.id} className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{provider.name}</h3>
                <span className="mt-2 inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">{provider.type}</span>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={provider.enabled}
                  onChange={(event) => void toggleProvider(provider.id, event.target.checked)}
                  className="h-4 w-4"
                />
                <span>Enabled</span>
              </label>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              {provider.domains?.length > 0 ? <p>Domains: {provider.domains.join(', ')}</p> : <p>No domains configured yet.</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {providers.length === 0 && !showAddForm ? (
        <motion.div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/70 p-12 text-center text-slate-500" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          No SSO providers configured yet. Add one to enable enterprise authentication.
        </motion.div>
      ) : null}
    </motion.div>
  );
}

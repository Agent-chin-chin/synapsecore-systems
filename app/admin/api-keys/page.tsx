'use client'
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface APIKey {
  _id: string;
  name: string;
  key?: string;
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy?: { fullname: string };
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  async function fetchAPIKeys() {
    try {
      setLoading(true);
      const res = await fetch('/api/api-keys', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch API keys');
      const data = await res.json();
      setApiKeys(data.apiKeys || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateKey(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to create API key');
      const data = await res.json();
      setApiKeys([...apiKeys, data.apiKey]);
      setNewKeyName('');
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm('Delete this API key? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/api-keys/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete API key');
      setApiKeys(apiKeys.filter(k => k._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete API key');
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-white">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-8 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">API Access & Keys</h1>
          <p className="text-slate-400">Generate and manage API keys for programmatic access.</p>
        </div>
        <motion.button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          + Generate Key
        </motion.button>
      </motion.div>

      {error && (
        <motion.div
          className="mb-4 rounded-lg bg-red-900/70 px-4 py-3 text-red-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {error}
        </motion.div>
      )}

      {showCreateForm && (
        <motion.div
          className="mb-6 bg-slate-900 rounded-lg p-6 border border-slate-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Create New API Key</h2>
          <form onSubmit={handleCreateKey} className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="My API Key"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
              required
            />
            <motion.button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-500 disabled:opacity-60"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {creating ? 'Creating...' : 'Create'}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:border-slate-500"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
          </form>
        </motion.div>
      )}

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {apiKeys.map((key, idx) => (
          <motion.div
            key={key._id}
            className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-cyan-500/40 transition"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{key.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Created {new Date(key.createdAt).toLocaleDateString()}
                  {key.createdBy && ` by ${key.createdBy.fullname}`}
                </p>
              </div>
              <motion.button
                onClick={() => handleDeleteKey(key._id)}
                className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Delete
              </motion.button>
            </div>
            {key.key && (
              <div className="bg-slate-950 rounded p-3 font-mono text-sm break-all border border-slate-800">
                <span className="text-slate-500">Key: </span>
                <span className="text-green-400">{key.key}</span>
              </div>
            )}
            {key.lastUsed && (
              <p className="text-xs text-slate-500 mt-2">
                Last used: {new Date(key.lastUsed).toLocaleString()}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {apiKeys.length === 0 && !showCreateForm && (
        <div className="text-center py-12 text-slate-500">
          No API keys generated. Create one to get started.
        </div>
      )}
    </motion.div>
  );
}

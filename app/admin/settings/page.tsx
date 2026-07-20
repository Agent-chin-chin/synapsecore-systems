'use client'
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Setting {
  _id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data.settings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(setting: Setting) {
    try {
      const res = await fetch(`/api/settings/${setting._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting)
      });
      if (!res.ok) throw new Error('Failed to save setting');
      setSaveStatus(`Saved ${setting.key}`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save setting');
    }
  }

  function updateSettingValue(key: string, value: string) {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  }

  const categories = [...new Set(settings.map(s => s.category))];

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
        <p className="text-slate-400">Configure application-wide settings and preferences.</p>
      </motion.div>

      {error && (
        <motion.div
          className="mb-4 rounded-xl bg-red-900/70 px-4 py-3 text-red-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {error}
        </motion.div>
      )}
      {saveStatus && (
        <motion.div
          className="mb-4 rounded-xl bg-green-900/70 px-4 py-3 text-green-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {saveStatus}
        </motion.div>
      )}

      {categories.map((category, catIdx) => (
        <motion.div
          key={category}
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + catIdx * 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
          <div className="space-y-4">
            {settings.filter(s => s.category === category).map((setting, idx) => (
              <motion.div
                key={setting.key}
                className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-cyan-500/40 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + catIdx * 0.1 + idx * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-sm font-medium mb-2">{setting.key}</label>
                <p className="text-xs text-slate-500 mb-3">{setting.description}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => updateSettingValue(setting.key, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <motion.button
                    onClick={() => handleSave(setting)}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {settings.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No settings configured yet.
        </div>
      )}
    </motion.div>
  );
}

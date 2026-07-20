'use client'
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Settings {
  emailNotifications: boolean;
  courseReminders: boolean;
  assessmentAlerts: boolean;
  communityDigest: boolean;
  darkMode: boolean;
  language: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    courseReminders: true,
    assessmentAlerts: true,
    communityDigest: false,
    darkMode: true,
    language: 'en',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/learner/settings', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/learner/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings })
      });

      if (!res.ok) throw new Error('Failed to save settings');

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Learning Preferences</h1>
          <Link href="/learner/profile" className="text-green-400 hover:underline">
            ← Back
          </Link>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-900 border border-green-400 rounded-lg text-green-400">
            ✓ Settings saved successfully!
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-green-400 mb-4">📬 Notifications</h2>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'courseReminders', label: 'Course Reminders' },
                { key: 'assessmentAlerts', label: 'Assessment Alerts' },
                { key: 'communityDigest', label: 'Community Digest' },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                >
                  <label className="font-medium">{item.label}</label>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof Settings] as boolean}
                    onChange={() => handleToggle(item.key as keyof Settings)}
                    className="w-5 h-5 accent-green-400"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-green-400 mb-4">🎨 Display</h2>
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.5 }}
                whileHover={{ scale: 1.01, x: 2 }}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <label className="font-medium">Dark Mode</label>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                  className="w-5 h-5 accent-green-400"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-green-400 mb-4">🌍 Language</h2>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleSave}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition"
            >
              Save Settings
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

'use client'
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface UserProfile {
  fullname: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: string;
  subscriptionPlan?: string;
  createdAt: string;
}

export default function ClientProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullname: '', phone: '', companyName: '', address: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to load profile');
        }

        const data = await res.json();
        const user = data.data;

        if (!user) {
          router.push('/login');
          return;
        }

        const profileData: UserProfile = {
          fullname: user.fullname || 'Client',
          email: user.email,
          phone: user.phone || '',
          companyName: user.companyName || '',
          address: user.address || '',
          subscriptionPlan: user.subscriptionPlan || 'Basic',
          createdAt: user.createdAt || new Date().toISOString()
        };

        setProfile(profileData);
        setFormData({
          fullname: profileData.fullname,
          phone: profileData.phone || '',
          companyName: profileData.companyName || '',
          address: profileData.address || ''
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData })
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to update profile');
      }

      setProfile(prev => prev ? { ...prev, ...formData } : prev);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Unable to load profile</h2>
          <p>{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account information</p>
        </div>
        <motion.button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </motion.button>
      </motion.div>

      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl text-white">
            {profile.fullname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.fullname}</h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium text-gray-900">{profile.companyName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{profile.address || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscription Plan</p>
              <p className="font-medium text-gray-900">{profile.subscriptionPlan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

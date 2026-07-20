'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  joinDate: string;
  specialization: string;
  certifications: number;
  totalHours: number;
  learningStreak: number;
  enrolledCourses: number;
}

export default function ProfileClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullname: '', bio: '', learningGoals: '', experience: '', location: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/learner/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to save profile');
      const data = await res.json();
      if (data.user) {
        const fullname = data.user.fullname || 'Learner';
        const [firstName, ...rest] = fullname.split(' ');
        const lastName = rest.join(' ');
        const learnerProfile = data.user.learnerProfile || {};
        setProfile(prev => prev ? {
          ...prev,
          firstName,
          lastName,
          bio: learnerProfile.bio || prev.bio
        } : prev);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/learner/login');
            return;
          }
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || 'Unable to load profile.');
          return;
        }

        const data = await response.json();
        const user = data.data;

        if (!user || !user.email) {
          router.push('/learner/login');
          return;
        }

        const fullname = user.fullname || 'Learner';
        const [firstName, ...rest] = fullname.split(' ');
        const lastName = rest.join(' ');
        const learnerProfile = user.learnerProfile || {};

        setProfile({
          firstName,
          lastName,
          email: user.email,
          bio: learnerProfile.bio || learnerProfile.learningGoals || 'Welcome to your cybersecurity learning profile.',
          joinDate: user.createdAt || new Date().toISOString(),
          specialization:
            learnerProfile.experience?.charAt(0).toUpperCase() + learnerProfile.experience?.slice(1) ||
            learnerProfile.learningGoals?.split(/[.\n]/)[0] ||
            'Cybersecurity',
          certifications: Array.isArray(learnerProfile.certifications) ? learnerProfile.certifications.length : 0,
          totalHours: learnerProfile.totalHoursLearned ?? 0,
          learningStreak: learnerProfile.learningStreak ?? 0,
          enrolledCourses: Array.isArray(learnerProfile.enrolledCourses) ? learnerProfile.enrolledCourses.length : 0,
        });

        setEditForm({
          fullname: user.fullname || '',
          bio: learnerProfile.bio || '',
          learningGoals: learnerProfile.learningGoals || '',
          experience: learnerProfile.experience || '',
          location: learnerProfile.location || ''
        });
      } catch (err) {
        console.error('Failed to load learner profile:', err);
        setError('Unable to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-green-400 text-2xl font-bold mb-4">Loading your profile...</div>
          <p className="text-gray-400">Please wait while we load your learner dashboard.</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8"
      >
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Unable to load profile</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => router.push('/learner/login')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              Return to login
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-green-400">My Profile</h1>
          <Link href="/learner/dashboard" className="text-green-400 hover:underline">
            ← Back to Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-3xl">👤</div>
              <div>
                <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-gray-400">{profile.email}</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Member Since', value: new Date(profile.joinDate).toLocaleDateString() },
              { label: 'Specialization', value: profile.specialization },
              { label: 'Certifications', value: profile.certifications },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <div className="text-gray-400 text-sm mb-1">{item.label}</div>
                <div className="text-xl font-bold text-green-400">{item.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Hours', value: profile.totalHours },
              { label: 'Learning Streak', value: `${profile.learningStreak} days` },
              { label: 'Courses Enrolled', value: profile.enrolledCourses },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <div className="text-gray-400 text-sm mb-1">{item.label}</div>
                <div className="text-xl font-bold text-green-400">{item.value}</div>
              </motion.div>
            ))}
          </div>

          {!isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-2">Bio</h3>
              <p className="text-gray-300">{profile.bio}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullname}
                  onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Learning Goals</label>
                <textarea
                  value={editForm.learningGoals}
                  onChange={(e) => setEditForm({ ...editForm, learningGoals: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Experience Level</label>
                <select
                  value={editForm.experience}
                  onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.div>
            </motion.div>
          )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { href: '/learner/certificates', icon: '🏆', title: 'Certificates', desc: 'View your earned certificates' },
            { href: '/learner/settings', icon: '⚙️', title: 'Settings', desc: 'Manage your preferences' },
          ].map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Link href={item.href} className="block bg-gray-800 border border-gray-700 hover:border-green-400 rounded-lg p-6 transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        </motion.div>
      </div>
      </motion.div>
  );
}

'use client'
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';




interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  learningStreak: number;
  totalHours: number;
}

interface RecentActivity {
  id: string;
  title: string;
  type: 'course' | 'assessment' | 'certificate';
  timestamp: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    learningStreak: 0,
    totalHours: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learnerName, setLearnerName] = useState('');

  useEffect(() => {
    const fetchLearnerData = async () => {
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
          return;
        }

        const data = await response.json();
        const user = data.data;

        if (!user) {
          router.push('/learner/login');
          return;
        }

        setLearnerName(user.fullname || 'Learner');

        const learnerProfile = user.learnerProfile || {};
        const enrolledCourses = Array.isArray(learnerProfile.enrolledCourses) ? learnerProfile.enrolledCourses.length : 0;
        const completedCourses = Array.isArray(learnerProfile.completedCourses) ? learnerProfile.completedCourses.length : 0;
        const totalHours = learnerProfile.totalHoursLearned ?? 0;
        const learningStreak = learnerProfile.learningStreak ?? 0;

        setStats({
          enrolledCourses,
          completedCourses,
          learningStreak,
          totalHours,
        });

        if (enrolledCourses > 0 || completedCourses > 0) {
          setActivities([
            {
              id: '1',
              title: `You are enrolled in ${enrolledCourses} active course${enrolledCourses === 1 ? '' : 's'}. Keep progressing!`,
              type: 'course',
              timestamp: new Date().toISOString(),
              status: enrolledCourses > 0 ? 'in-progress' : 'not-started',
            },
            {
              id: '2',
              title: learnerProfile.learningGoals
                ? `Current goal: ${learnerProfile.learningGoals}`
                : 'Set a learning goal to guide your progress.',
              type: 'assessment',
              timestamp: new Date().toISOString(),
              status: learnerProfile.learningGoals ? 'in-progress' : 'not-started',
            },
            {
              id: '3',
              title: completedCourses > 0
                ? `You have completed ${completedCourses} course${completedCourses === 1 ? '' : 's'} so far.`
                : 'Complete your first course to earn certificates.',
              type: 'certificate',
              timestamp: new Date().toISOString(),
              status: completedCourses > 0 ? 'completed' : 'not-started',
            }
          ]);
        } else {
          setActivities([
            {
              id: '1',
              title: 'Start your first course to build your cybersecurity skills.',
              type: 'course',
              timestamp: new Date().toISOString(),
              status: 'not-started',
            },
            {
              id: '2',
              title: 'Browse learner courses and enroll in your first program.',
              type: 'assessment',
              timestamp: new Date().toISOString(),
              status: 'not-started',
            }
          ]);
        }
      } catch (error) {
        console.error('Unable to load dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLearnerData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-400">Learning Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back{learnerName ? `, ${learnerName}` : ''}! Keep up your learning journey.</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/learner/profile" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
              My Profile
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {loading ? (
          <div className="text-center py-12"><div className="text-green-400 text-xl">Loading...</div></div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Enrolled Courses', value: stats.enrolledCourses },
                { label: 'Completed Courses', value: stats.completedCourses },
                { label: 'Day Streak', value: `${stats.learningStreak}🔥` },
                { label: 'Total Hours', value: stats.totalHours },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-400 transition"
                >
                  <div className="text-3xl font-bold text-green-400">{item.value}</div>
                  <div className="text-gray-400 mt-2">{item.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { href: '/learner/courses', icon: '📚', label: 'Browse Courses' },
                { href: '/learner/my-courses', icon: '📖', label: 'My Courses' },
                { href: '/learner/assessments', icon: '✅', label: 'Quizzes' },
              ].map((btn, index) => (
                <motion.div
                  key={btn.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                >
                  <Link href={btn.href} className="block bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition">
                    <div className="text-xl font-bold mb-2">{btn.icon}</div>
                    <div>{btn.label}</div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-400 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{activity.title}</div>
                      <div className="text-sm text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded text-sm ${activity.status === 'completed' ? 'bg-green-900 text-green-400' : activity.status === 'in-progress' ? 'bg-blue-900 text-blue-400' : 'bg-gray-600 text-gray-300'}`}>
                        {activity.status === 'completed' ? '✓ Completed' : activity.status === 'in-progress' ? '⏳ In Progress' : 'Not Started'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

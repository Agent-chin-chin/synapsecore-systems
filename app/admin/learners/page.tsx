'use client'
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatCard, StatsCardGroup } from '@/components/dashboard/stat-card';

type TabType = 'overview' | 'pending' | 'active' | 'suspended' | 'courses' | 'certifications' | 'support';

interface LearnerStats {
  totalLearners: number;
  activeLearners: number;
  pendingApproval: number;
  suspendedLearners: number;
  totalEnrollments: number;
  averageProgress: number;
  certificationsIssued: number;
  supportTickets: number;
}

interface LearnerData {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  city: string;
  country: string;
  phone: string;
  experience: string;
  status: string;
  enrolledCourses: number;
  progress: number;
  lastActive: string;
  approvalStatus: string;
  paymentStatus: string;
  selectedCourse: string;
  paymentPlan: string;
}

export default function AdminLearnersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<LearnerStats>({
    totalLearners: 0,
    activeLearners: 0,
    pendingApproval: 0,
    suspendedLearners: 0,
    totalEnrollments: 0,
    averageProgress: 0,
    certificationsIssued: 0,
    supportTickets: 0,
  });
  const [learners, setLearners] = useState<LearnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLearnerData();
  }, []);

  async function fetchLearnerData() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/learners', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch learner data');

      const data = await response.json();
      setStats(data.data.stats);
      setLearners(data.data.learners);
    } catch (err: any) {
      setError(err.message || 'Failed to load learner data');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (learnerId: string) => {
    try {
      const response = await fetch(`/api/admin/learners/${learnerId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to approve learner');
      fetchLearnerData();
    } catch (err: any) {
      console.error('Error approving learner:', err);
    }
  };

  const handleReject = async (learnerId: string) => {
    try {
      const response = await fetch(`/api/admin/learners/${learnerId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to reject learner');
      fetchLearnerData();
    } catch (err: any) {
      console.error('Error rejecting learner:', err);
    }
  };

  const handleSuspend = async (learnerId: string) => {
    try {
      const response = await fetch(`/api/admin/learners/${learnerId}/suspend`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to suspend learner');
      fetchLearnerData();
    } catch (err: any) {
      console.error('Error suspending learner:', err);
    }
  };

  const handleUnsuspend = async (learnerId: string) => {
    try {
      const response = await fetch(`/api/admin/learners/${learnerId}/unsuspend`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to unsuspend learner');
      fetchLearnerData();
    } catch (err: any) {
      console.error('Error unsuspending learner:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent w-12 h-12"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <motion.div
        className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Learner Management</h1>
          <p className="mt-2 text-sm text-slate-400">Manage learner registrations, progress, certifications, and support.</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatsCardGroup title="Learner Overview">
          <StatCard title="Total Learners" value={stats.totalLearners} icon="👥" color="blue" trend={{ value: 12, isPositive: true }} />
          <StatCard title="Active Learners" value={stats.activeLearners} icon="🟢" color="green" trend={{ value: 8, isPositive: true }} />
          <StatCard title="Pending Approval" value={stats.pendingApproval} icon="⏳" color="orange" trend={{ value: 3, isPositive: false }} />
          <StatCard title="Suspended" value={stats.suspendedLearners} icon="⛔" color="red" trend={{ value: 1, isPositive: false }} />
          <StatCard title="Total Enrollments" value={stats.totalEnrollments} icon="📚" color="purple" />
          <StatCard title="Certificates Issued" value={stats.certificationsIssued} icon="🏆" color="green" />
        </StatsCardGroup>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="rounded-[2rem] border border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/30 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-wrap border-b border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'pending', label: 'Pending Approval', icon: '⏳' },
            { id: 'active', label: 'Active Learners', icon: '👥' },
            { id: 'suspended', label: 'Suspended', icon: '⛔' },
            { id: 'courses', label: 'Courses & Progress', icon: '📚' },
            { id: 'certifications', label: 'Certifications', icon: '🏆' },
            { id: 'support', label: 'Support', icon: '💬' },
          ].map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400 bg-slate-950/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
                  <h3 className="font-semibold text-white">Quick Actions</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                      Approve pending learner registrations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                      Review course enrollments
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                      Issue certificates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                      Monitor learning progress
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
                  <h3 className="font-semibold text-white">Key Metrics</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average Progress</span>
                      <span className="font-semibold text-cyan-400">{stats.averageProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${stats.averageProgress}%` }}></div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-400">Active Rate</span>
                      <span className="font-semibold text-emerald-400">{stats.totalLearners ? Math.round((stats.activeLearners / stats.totalLearners) * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pending Approval Tab */}
          {activeTab === 'pending' && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white">Learners Awaiting Approval</h3>
              {learners.filter(l => l.approvalStatus === 'pending').length === 0 ? (
                <p className="text-slate-400">No pending approvals.</p>
              ) : (
                <div className="space-y-3">
                  {learners.filter(l => l.approvalStatus === 'pending').map((learner, idx) => (
                     <motion.div
                       key={learner.id}
                       className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/50 p-4 hover:border-cyan-500/40 transition"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1 + idx * 0.05 }}
                       whileHover={{ scale: 1.01 }}
                     >
                       <div className="flex items-center gap-4">
                         {learner.profilePicture ? (
                           <img src={learner.profilePicture} alt={learner.name} className="h-10 w-10 rounded-full object-cover border border-slate-600" />
                         ) : (
                           <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                             {learner.name.charAt(0).toUpperCase()}
                           </div>
                         )}
                         <div>
                           <p className="font-medium text-white">{learner.name}</p>
                           <p className="text-sm text-slate-400">{learner.email}</p>
                           <p className="text-xs text-slate-500">
                             {[learner.dateOfBirth, learner.gender, learner.city, learner.country].filter(Boolean).join(' • ') || 'No additional info'}
                           </p>
                         </div>
                       </div>
                       <div className="flex gap-2">
                         <button
                           onClick={() => handleApprove(learner.id)}
                           className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
                         >
                           Approve
                         </button>
                         <button
                           onClick={() => handleReject(learner.id)}
                           className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 transition"
                         >
                           Reject
                         </button>
                       </div>
                     </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Active Learners Tab */}
          {activeTab === 'active' && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white">Active Learners</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-300">Picture</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Name</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Email</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Date of Birth</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Gender</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Location</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Phone</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Selected Course</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Payment</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Experience</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Courses</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Progress</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Last Active</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {learners.filter(l => l.status === 'approved').map((learner, idx) => (
                      <motion.tr
                        key={learner.id}
                        className="hover:bg-slate-800/50 transition"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        whileHover={{ scale: 1.005 }}
                      >
                        <td className="px-4 py-3">
                          {learner.profilePicture ? (
                            <img src={learner.profilePicture} alt={learner.name} className="h-10 w-10 rounded-full object-cover border border-slate-600" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                              {learner.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white">{learner.name}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.email}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.dateOfBirth || '-'}</td>
                        <td className="px-4 py-3 text-slate-300 capitalize">{learner.gender || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{[learner.city, learner.country].filter(Boolean).join(', ') || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.phone || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.selectedCourse || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            learner.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            learner.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {learner.paymentStatus === 'completed' ? 'Paid' : learner.paymentStatus === 'pending' ? 'Pending' : 'No Payment'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 capitalize">{learner.experience}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.enrolledCourses}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-slate-700">
                              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${learner.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-400">{learner.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{learner.lastActive}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleSuspend(learner.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition"
                          >
                            Suspend
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Suspended Learners Tab */}
          {activeTab === 'suspended' && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white">Suspended Learners</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-300">Picture</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Name</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Email</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Date of Birth</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Gender</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Location</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Phone</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Selected Course</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Payment</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Experience</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Courses</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Progress</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Last Active</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {learners.filter(l => l.status === 'suspended').map((learner, idx) => (
                      <motion.tr
                        key={learner.id}
                        className="hover:bg-slate-800/50 transition"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        whileHover={{ scale: 1.005 }}
                      >
                        <td className="px-4 py-3">
                          {learner.profilePicture ? (
                            <img src={learner.profilePicture} alt={learner.name} className="h-10 w-10 rounded-full object-cover border border-slate-600" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                              {learner.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white">{learner.name}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.email}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.dateOfBirth || '-'}</td>
                        <td className="px-4 py-3 text-slate-300 capitalize">{learner.gender || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{[learner.city, learner.country].filter(Boolean).join(', ') || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.phone || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.selectedCourse || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            learner.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            learner.paymentStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>
                            {learner.paymentStatus === 'completed' ? 'Paid' : learner.paymentStatus === 'pending' ? 'Pending' : 'No Payment'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 capitalize">{learner.experience}</td>
                        <td className="px-4 py-3 text-slate-300">{learner.enrolledCourses}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-slate-700">
                              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${learner.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-400">{learner.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{learner.lastActive}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleUnsuspend(learner.id)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                          >
                            Unsuspend
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Courses & Progress Tab */}
          {activeTab === 'courses' && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white">Course Enrollments & Progress</h3>
              <p className="text-sm text-slate-400">Track learner enrollment status, progress, and course completion metrics.</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { course: 'Cybersecurity Basics', enrolled: 24, completed: 12, avgProgress: 65 },
                  { course: 'Network Security', enrolled: 18, completed: 9, avgProgress: 72 },
                  { course: 'Malware Analysis', enrolled: 12, completed: 8, avgProgress: 58 },
                  { course: 'Compliance & Auditing', enrolled: 15, completed: 7, avgProgress: 61 },
                  { course: 'Incident Response', enrolled: 10, completed: 6, avgProgress: 75 },
                  { course: 'Forensics 101', enrolled: 8, completed: 5, avgProgress: 80 },
                ].map((item, idx) => (
                  <motion.div
                    key={item.course}
                    className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 hover:border-cyan-500/40 transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <h4 className="font-medium text-white">{item.course}</h4>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-300">
                        <span>Enrolled</span>
                        <span className="font-semibold text-cyan-400">{item.enrolled}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Completed</span>
                        <span className="font-semibold text-emerald-400">{item.completed}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Avg Progress</span>
                        <span className="font-semibold text-orange-400">{item.avgProgress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white">Learner Certifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-300">Learner</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Course</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Score</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Earned Date</th>
                      <th className="px-4 py-3 font-semibold text-slate-300">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {[
                      { learner: 'Alice Johnson', course: 'Cybersecurity Basics', score: 92, date: '2026-05-15', cert: 'View' },
                      { learner: 'Bob Smith', course: 'Network Security', score: 88, date: '2026-05-10', cert: 'View' },
                      { learner: 'Carol Davis', course: 'Malware Analysis', score: 85, date: '2026-04-28', cert: 'View' },
                    ].map((item, idx) => (
                      <motion.tr
                        key={item.learner}
                        className="hover:bg-slate-800/50 transition"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        whileHover={{ scale: 1.005 }}
                      >
                        <td className="px-4 py-3 text-white">{item.learner}</td>
                        <td className="px-4 py-3 text-slate-300">{item.course}</td>
                        <td className="px-4 py-3 text-emerald-400 font-semibold">{item.score}%</td>
                        <td className="px-4 py-3 text-slate-400">{item.date}</td>
                        <td className="px-4 py-3">
                          <button className="text-cyan-400 hover:text-cyan-300 transition">{item.cert}</button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white">Learner Support Tickets</h3>
              <div className="space-y-3">
                {[
                  { id: 1, learner: 'John Doe', issue: 'Cannot access course video', priority: 'high', status: 'open' },
                  { id: 2, learner: 'Jane Smith', issue: 'Quiz submission failed', priority: 'medium', status: 'open' },
                  { id: 3, learner: 'Mark Wilson', issue: 'Certificate download issue', priority: 'low', status: 'closed' },
                ].map((ticket, idx) => (
                  <motion.div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/50 p-4 hover:border-cyan-500/40 transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div>
                      <p className="font-medium text-white">{ticket.learner}</p>
                      <p className="text-sm text-slate-400">{ticket.issue}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        ticket.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                        ticket.priority === 'medium' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

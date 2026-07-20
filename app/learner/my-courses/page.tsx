'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Award } from 'lucide-react';

interface EnrollmentCourse {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  duration?: string;
  instructor?: { name?: string };
  thumbnail?: string;
}
interface Enrollment {
  enrollmentId: string;
  status: string;
  progress: { completedLessons: number; totalLessons: number; progressPercentage: number };
  enrolledAt?: string;
  course: EnrollmentCourse | null;
  certificate: { earned: boolean };
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/learner/enrollments', { credentials: 'include' });
        if (res.status === 401) {
          setUnauthorized(true);
          setMessage('Please login to view your enrolled courses.');
          return;
        }
        if (!res.ok) {
          setMessage('Unable to load your courses.');
          return;
        }
        const data = await res.json();
        const list: Enrollment[] = data.enrollments || [];
        if (!list.length) {
          setMessage('You are not enrolled in any courses yet.');
          return;
        }
        setEnrollments(list);
      } catch {
        setMessage('Failed to load enrolled courses.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 md:px-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Learner Dashboard</p>
              <h1 className="text-4xl font-bold text-white">My Courses</h1>
            </div>
            <Link
              href="/learner/courses"
              className="inline-flex items-center gap-2 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <BookOpen className="size-4" /> Browse Catalog
            </Link>
          </div>
          <p className="mt-3 text-slate-400">Continue your training or re-open courses you've already enrolled in.</p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400">Loading your enrolled courses...</div>
        )}

        {!loading && message && !enrollments.length && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400">
            <p>{message}</p>
            <Link
              href={unauthorized ? "/learner/login" : "/learner/courses"}
              className="mt-4 inline-flex rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              {unauthorized ? "Login" : "Explore Courses"}
            </Link>
          </div>
        )}

        {!loading && enrollments.length > 0 && (
          <div className="grid gap-6 xl:grid-cols-2">
            {enrollments.map((entry, index) => {
              const course = entry.course;
              if (!course) return null;
              const pct = Math.min(entry.progress.progressPercentage ?? 0, 100);
              return (
                <motion.div
                  key={entry.enrollmentId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
                      <p className="mt-2 text-slate-400 line-clamp-2">{course.description}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-3xl bg-slate-950 px-4 py-2 text-sm text-slate-300">
                      <CheckCircle className="text-emerald-400" />
                      {entry.status?.toUpperCase() || 'ENROLLED'}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-950/50 p-4 text-slate-300">
                      <div className="text-sm text-slate-400 uppercase tracking-[0.18em]">Instructor</div>
                      <p className="mt-2 text-white">{course.instructor?.name || 'Instructor TBD'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-950/50 p-4 text-slate-300">
                      <div className="text-sm text-slate-400 uppercase tracking-[0.18em]">Duration</div>
                      <p className="mt-2 text-white">{course.duration || 'Self-paced'}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Progress</span>
                      <span>{pct}% · {entry.progress.completedLessons ?? 0}/{entry.progress.totalLessons ?? 0} lessons</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span><span className="font-semibold text-slate-100">{course.level || '—'}</span></span>
                      {entry.certificate?.earned && (
                        <span className="flex items-center gap-1 text-emerald-300"><Award size={14} /> Certified</span>
                      )}
                    </div>
                    <Link
                      href={`/learner/courses/${course._id}`}
                      className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      Continue Course
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

'use client'
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: string;
}

export default function ProgressPage() {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/learner/dashboard', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCourses(data.enrolledCourses || []);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Learning Progress</h1>
          <p className="mt-2 text-slate-400">Track your progress across all enrolled courses</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-12 text-center">
            <div className="mb-4 text-4xl">📚</div>
            <h3 className="text-xl font-semibold text-white">No courses enrolled</h3>
            <p className="mt-2 text-slate-400">Start learning by enrolling in a course</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition hover:bg-slate-800"
              >
                <h3 className="text-xl font-semibold text-white">{course.courseTitle}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
                <div className="mt-4 h-3 w-full rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-400">{course.progress}%</span>
                  <span className="text-xs text-slate-500 capitalize">{course.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import CourseCard from '@/components/learner/course-card';
import CourseFilters from '@/components/learner/course-filters';
import { AlertCircle, BookOpen } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor?: {
    name?: string;
  };
  category?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  enrollmentCount?: number;
  rating?: number;
  thumbnail?: string;
  price?: number;
}

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (levelFilter !== 'all') params.set('level', levelFilter);
        if (categoryFilter) params.set('category', categoryFilter);
        if (searchTerm) params.set('search', searchTerm);

        const response = await fetch(`/api/learner/courses?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Unable to load course catalog');
        }

        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(loadCourses, 200);
    return () => clearTimeout(timeout);
  }, [levelFilter, categoryFilter, searchTerm]);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      }),
    [courses, searchTerm]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-950"
    >
      <div className="border-b border-slate-800 bg-slate-900/50 px-4 py-8 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Learning Catalog</p>
              <h1 className="text-4xl font-bold text-white">Cybersecurity Courses</h1>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 px-5 py-4 text-sm text-slate-400 shadow-sm">
              <span className="font-semibold text-white">{filteredCourses.length}</span> courses available
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-slate-400">Filter by level, search course titles, and explore hands-on cybersecurity training from beginner to advanced.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <CourseFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              levelFilter={levelFilter}
              onLevelChange={setLevelFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />
          </motion.div>

          <div className="lg:col-span-3">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-[280px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 text-slate-400"
              >
                Loading courses...
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200"
              >
                {error}
              </motion.div>
            )}

            {!loading && !error && filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400"
              >
                No courses match your search. Try a broader query or adjust the level/category filters.
              </motion.div>
            )}

            {!loading && !error && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client'
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CourseForm {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  published: boolean;
  featured: boolean;
  notes: {
    summary: string;
    explanation: string;
    practical: string;
  };
}

interface AdminCourse extends CourseForm {
  _id: string;
}

const categories = ['Security', 'Hacking', 'Networks', 'Compliance', 'Forensics', 'Administration'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const defaultForm: CourseForm = {
  title: '',
  description: '',
  category: 'Security',
  level: 'Beginner',
  price: 0,
  duration: '4 weeks',
  published: true,
  featured: false,
  notes: {
    summary: '',
    explanation: '',
    practical: '',
  },
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [form, setForm] = useState<CourseForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/courses', { cache: 'no-store', credentials: 'include' });
      if (!response.ok) {
        throw new Error('Unable to load courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load courses';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCourses();
  }, []);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses';
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Course save failed');
      }

      await loadCourses();
      resetForm();
      setMessage(editingId ? 'Course updated successfully.' : 'Course created successfully.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to save course';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: AdminCourse) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration,
      published: course.published,
      featured: course.featured,
      notes: {
        summary: course.notes?.summary || '',
        explanation: course.notes?.explanation || '',
        practical: course.notes?.practical || '',
      },
    });
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course permanently?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Delete failed');
      }
      await loadCourses();
      setMessage('Course deleted successfully.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to delete course';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <p className="text-sm text-slate-400">Create, edit, publish, and remove learner courses.</p>
        </div>
        <motion.button
          type="button"
          onClick={resetForm}
          className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          New Course
        </motion.button>
      </motion.div>

      {message ? (
        <motion.div
          className="rounded-3xl border border-cyan-500/20 bg-slate-900 px-6 py-4 text-sm text-slate-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {message}
        </motion.div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <motion.section
          className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white">Course Catalog</h2>
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading courses...</div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-800">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-900 text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, idx) => (
                    <motion.tr
                      key={course._id}
                      className="border-t border-slate-800 hover:bg-slate-900/70"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="px-4 py-3 text-slate-200">{course.title}</td>
                      <td className="px-4 py-3 text-slate-400">{course.category}</td>
                      <td className="px-4 py-3 text-slate-400">{course.level}</td>
                      <td className="px-4 py-3 text-slate-400">{course.price ? `₦${course.price.toLocaleString()}` : 'Free'}</td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="flex flex-wrap gap-2">
                          <motion.button
                            type="button"
                            onClick={() => handleEdit(course)}
                            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-slate-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => handleDelete(course._id)}
                            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        <motion.section
          className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white">{editingId ? 'Edit Course' : 'New Course'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-400">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm text-slate-400">Level</span>
                <select
                  value={form.level}
                  onChange={(event) => setForm({ ...form, level: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Price</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Duration</span>
                <input
                  value={form.duration}
                  onChange={(event) => setForm({ ...form, duration: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-slate-400">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-400">Published</span>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => setForm({ ...form, published: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-cyan-400"
                  />
                  <span className="text-sm text-slate-400">Show course in learner catalog</span>
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-400">Featured</span>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-cyan-400"
                  />
                  <span className="text-sm text-slate-400">Highlight course on the learner landing page</span>
                </div>
              </label>
            </div>

            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm text-slate-400">Summary</span>
                <textarea
                  value={form.notes.summary}
                  onChange={(event) => setForm({ ...form, notes: { ...form.notes, summary: event.target.value } })}
                  rows={3}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Explanation</span>
                <textarea
                  value={form.notes.explanation}
                  onChange={(event) => setForm({ ...form, notes: { ...form.notes, explanation: event.target.value } })}
                  rows={3}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Practical</span>
                <textarea
                  value={form.notes.practical}
                  onChange={(event) => setForm({ ...form, notes: { ...form.notes, practical: event.target.value } })}
                  rows={3}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <motion.button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {editingId ? 'Update Course' : 'Create Course'}
              </motion.button>
              {editingId ? (
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel Edit
                </motion.button>
              ) : null}
            </div>
          </form>
        </motion.section>
      </div>
    </motion.div>
  );
}

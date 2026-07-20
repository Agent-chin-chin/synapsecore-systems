'use client';

import { Star, Users, Clock } from 'lucide-react';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  enrollmentCount?: number;
  rating?: number;
  price?: number;
  thumbnail?: string;
  instructor?: {
    name?: string;
  };
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const levelColors = {
    'Beginner': 'bg-emerald-500/20 text-emerald-300',
    'Intermediate': 'bg-blue-500/20 text-blue-300',
    'Advanced': 'bg-red-500/20 text-red-300',
  };

  return (
    <Link href={`/learner/courses/${course._id}`}>
      <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 transition hover:border-emerald-500 hover:bg-slate-900/80">
        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-emerald-600 to-slate-900">
          <div className="absolute inset-0 bg-slate-900/50 transition group-hover:bg-slate-900/30" />
          <div className="flex h-full items-center justify-center text-4xl">📚</div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 font-semibold text-white line-clamp-2 group-hover:text-emerald-400">
              {course.title}
            </h3>
            <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${levelColors[course.level]}`}>
              {course.level}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>

          {/* Instructor */}
          {course.instructor?.name && (
            <p className="text-xs text-slate-500">by {course.instructor.name}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-emerald-500" />
                {course.duration}
              </div>
            )}
            {course.enrollmentCount !== undefined && (
              <div className="flex items-center gap-1">
                <Users size={14} className="text-emerald-500" />
                {course.enrollmentCount} enrolled
              </div>
            )}
            {course.rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-emerald-500 text-emerald-500" />
                {course.rating.toFixed(1)}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-2">
            {course.price !== undefined && (
              <span className="font-semibold text-emerald-400">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </span>
            )}
            <span className="text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition">
              View Course →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

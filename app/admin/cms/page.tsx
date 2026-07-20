import type { Metadata } from 'next';
import CourseEditorClient from './CourseEditorClient';

export const metadata: Metadata = {
  title: 'Course CMS — SynapseCore',
  description: 'Instructor course editor for modules, lessons, quizzes, downloads, and assignments.',
};

export default function CourseCMSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Course CMS</h1>
        <p className="text-sm text-slate-400">
          Create and manage courses, modules, lessons, quizzes, downloads, and assignments — no database editing required.
        </p>
      </div>
      <CourseEditorClient />
    </div>
  );
}

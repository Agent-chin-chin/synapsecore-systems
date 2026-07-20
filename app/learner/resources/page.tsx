'use client';

import ComingSoonCard from '@/components/ui/coming-soon-card';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <ComingSoonCard
          title="Learning resources are being curated"
          description="A richer library of downloadable materials, lesson notes, and guided assets will be released with the next update."
          version="Available in v1.1"
          features={['Downloadable notes', 'Resource filtering', 'Course-specific packs', 'Instructor uploads']}
          backHref="/learner/dashboard"
          browseHref="/learner/courses"
        />
      </div>
    </div>
  );
}

'use client';

import ComingSoonCard from '@/components/ui/coming-soon-card';

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <ComingSoonCard
          title="Certificates are being prepared"
          description="Certificate issuance and downloadable credentials will be introduced once course completion tracking is fully launched."
          version="Available in v1.1"
          features={['Course completion certificates', 'Downloadable badges', 'Shareable achievement links', 'Instructor verification']}
          backHref="/learner/dashboard"
          browseHref="/learner/courses"
        />
      </div>
    </div>
  );
}

'use client';

import ComingSoonCard from '@/components/ui/coming-soon-card';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <ComingSoonCard
          title="Community discussions are on the way"
          description="A learner community, peer discussions, and collaborative spaces will be released soon to make the platform more social and interactive."
          version="Available in v1.1"
          features={['Topic-based discussions', 'Peer replies', 'Live community highlights', 'Expert office hours']}
          backHref="/learner/dashboard"
          browseHref="/learner/courses"
        />
      </div>
    </div>
  );
}

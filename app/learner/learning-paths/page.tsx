'use client'
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ComingSoonCard from '@/components/ui/coming-soon-card';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Array<{
    courseId: string;
    courseTitle: string;
    status: 'completed' | 'in-progress' | 'not-started';
  }>;
  recommendedFor: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  completionTime: string;
}

export default function LearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await fetch('/api/learner/learning-paths', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setPaths(data.paths || []);
        }
      } catch (error) {
        console.error('Error fetching learning paths:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  // Mock learning paths if API doesn't return anything
  const displayPaths = paths.length > 0 ? paths : [
    {
      id: '1',
      title: 'Cybersecurity Fundamentals',
      description: 'Master the basics of cybersecurity, threat detection, and defense strategies.',
      courses: [
        { courseId: '1', courseTitle: 'Security Basics', status: 'not-started' },
        { courseId: '2', courseTitle: 'Network Security', status: 'not-started' },
        { courseId: '3', courseTitle: 'Application Security', status: 'not-started' }
      ],
      recommendedFor: 'Security professionals and beginners',
      skillLevel: 'beginner',
      completionTime: '8 weeks'
    },
    {
      id: '2',
      title: 'Ethical Hacking',
      description: 'Learn offensive security techniques and penetration testing methodologies.',
      courses: [
        { courseId: '4', courseTitle: 'Hacking Basics', status: 'not-started' },
        { courseId: '5', courseTitle: 'Penetration Testing', status: 'not-started' },
        { courseId: '6', courseTitle: 'Advanced Exploitation', status: 'not-started' }
      ],
      recommendedFor: 'Security professionals and ethical hackers',
      skillLevel: 'intermediate',
      completionTime: '10 weeks'
    }
  ];

  const skillLevelColors: Record<string, string> = {
    beginner: 'bg-green-900 text-green-200',
    intermediate: 'bg-yellow-900 text-yellow-200',
    advanced: 'bg-red-900 text-red-200'
  };

  const statusIcons: Record<string, string> = {
    completed: '✓',
    'in-progress': '⏳',
    'not-started': '○'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Learning Paths</h1>
          <p className="mt-2 text-slate-400">Guided learning journeys to master skills</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : (
          <ComingSoonCard
            title="Learning paths are coming soon"
            description="Guided journeys and milestone-based learning plans will be introduced in the next release so learners can follow a clear path from beginner to advanced."
            version="Available in v1.1"
            features={['Personalized roadmaps', 'Milestone tracking', 'Suggested next steps', 'Certification readiness']}
            backHref="/learner/dashboard"
            browseHref="/learner/courses"
          />
        )}
      </div>
    </motion.div>
  );
}

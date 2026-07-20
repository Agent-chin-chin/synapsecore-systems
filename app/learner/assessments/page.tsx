'use client'
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ComingSoonCard from '@/components/ui/coming-soon-card';

interface Assessment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'not-started';
  score?: number;
  maxScore: number;
  dueDate?: string;
}

export default function AssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) router.push('/learner/login');
        return res.json();
      })
      .then(() => {
        fetch('/api/learner/assessments', { credentials: 'include' })
          .then(res => res.ok ? res.json() : { assessments: [] })
          .then(data => {
            setAssessments(data.assessments || []);
            setLoading(false);
          })
          .catch(() => {
            router.push('/learner/login');
          });
      })
      .catch(() => {
        router.push('/learner/login');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="bg-gray-800 border-b border-gray-700 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-green-400">My Assessments</h1>
          <p className="text-gray-400 mt-1">Track your quiz progress and complete evaluations</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ComingSoonCard
          title="Assessments are on the roadmap"
          description="Interactive quizzes and graded assessments are being prepared for the next release. Until then, learners can continue browsing courses and building momentum through the catalog."
          version="Available in v1.1"
          features={['Timed quizzes', 'Auto-grading', 'Progress scoring', 'Skill badges']}
          backHref="/learner/dashboard"
          browseHref="/learner/courses"
        />
      </div>
    </motion.div>
  );
}

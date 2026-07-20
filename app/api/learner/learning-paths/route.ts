import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Enrollment from '@/lib/models/Enrollment';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const enrollments = await Enrollment.find({ learnerId: user.id }).populate('courseId');

    // Mock learning paths based on courses - in production, this would query a LearningPath model
    const paths = [
      {
        id: '1',
        title: 'Cybersecurity Fundamentals',
        description: 'Master the basics of cybersecurity, threat detection, and defense strategies.',
        courses: enrollments.slice(0, 3).map((e: any) => ({
          courseId: e.courseId._id.toString(),
          courseTitle: e.courseId.title,
          status: e.progress?.progressPercentage === 100 ? 'completed' : e.progress?.progressPercentage > 0 ? 'in-progress' : 'not-started'
        })),
        recommendedFor: 'Security professionals and beginners',
        skillLevel: 'beginner',
        completionTime: '8 weeks'
      },
      {
        id: '2',
        title: 'Ethical Hacking',
        description: 'Learn offensive security techniques and penetration testing methodologies.',
        courses: enrollments.slice(3, 6).map((e: any) => ({
          courseId: e.courseId._id.toString(),
          courseTitle: e.courseId.title,
          status: e.progress?.progressPercentage === 100 ? 'completed' : e.progress?.progressPercentage > 0 ? 'in-progress' : 'not-started'
        })).length > 0 ? enrollments.slice(3, 6).map((e: any) => ({
          courseId: e.courseId._id.toString(),
          courseTitle: e.courseId.title,
          status: e.progress?.progressPercentage === 100 ? 'completed' : e.progress?.progressPercentage > 0 ? 'in-progress' : 'not-started'
        })) : [
          { courseId: '1', courseTitle: 'Hacking Basics', status: 'not-started' },
          { courseId: '2', courseTitle: 'Penetration Testing', status: 'not-started' }
        ],
        recommendedFor: 'Security professionals and ethical hackers',
        skillLevel: 'intermediate',
        completionTime: '10 weeks'
      }
    ];

    return NextResponse.json({ paths });
  } catch (error) {
    console.error('Learning paths error:', error);
    return NextResponse.json({ error: 'Failed to fetch learning paths' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Enrollment from '@/lib/models/Enrollment';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const enrollments = await Enrollment.find({ learnerId: user.id }).populate('courseId');

    const learner = await User.findById(user.id);
    const enrolledCourses = enrollments.map((enrollment: any) => ({
      courseId: enrollment.courseId?._id.toString() || '',
      courseTitle: enrollment.courseId?.title || 'Unknown Course',
      progress: enrollment.progress?.progressPercentage || 0,
      completedLessons: enrollment.progress?.completedLessons || 0,
      totalLessons: enrollment.progress?.totalLessons || 0,
      status: enrollment.status || 'enrolled',
      enrolledAt: enrollment.createdAt
    }));

    return NextResponse.json({
      learner: {
        id: user.id,
        fullName: learner?.fullName || 'Learner',
        email: learner?.email
      },
      enrolledCourses,
      stats: {
        totalCourses: enrolledCourses.length,
        completedCourses: enrolledCourses.filter((c: any) => c.progress === 100).length,
        averageProgress: enrolledCourses.length > 0
          ? Math.round(enrolledCourses.reduce((sum: number, c: any) => sum + c.progress, 0) / enrolledCourses.length)
          : 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { authenticateAPI } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import Enrollment from '@/lib/models/Enrollment';

export async function POST(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user) {
    console.log('Enroll: No user authenticated');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Enroll: User authenticated', { userId: user.id, role: user.role });

  // Allow learner role (case-insensitive check)
  if (!user.role || user.role.toLowerCase() !== 'learner') {
    console.log('Enroll: Wrong role', { role: user.role, expected: 'learner' });
    return NextResponse.json({ error: 'Learner role required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { courseId } = body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'Missing or invalid courseId' }, { status: 400 });
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course || !course.published) {
      return NextResponse.json({ error: 'Course not found or unavailable' }, { status: 404 });
    }

    const learner = await User.findById(user.id);
    if (!learner) {
      return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
    }

    const enrolledCourses = learner.learnerProfile?.enrolledCourses || [];
    const alreadyEnrolled = enrolledCourses.some((entry: any) => entry.courseId?.toString() === courseId);
    if (alreadyEnrolled) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    const totalLessons = (course.modules as any[] || []).reduce((sum: number, module: any) => {
      return sum + ((module.lessons && module.lessons.length) || 0);
    }, 0);

    const enrollment = new Enrollment({
      learnerId: learner._id,
      courseId: course._id,
      status: 'active',
      progress: {
        completedLessons: 0,
        totalLessons,
        progressPercentage: 0,
        lastAccessedAt: new Date()
      },
      totalTimeSpent: 0
    });

    await enrollment.save();

    learner.learnerProfile = learner.learnerProfile || {};
    learner.learnerProfile.enrolledCourses = learner.learnerProfile.enrolledCourses || [];
    learner.learnerProfile.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(),
      status: 'enrolled',
      progress: 0
    });
    await learner.save();

    await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } });

    return NextResponse.json({
      success: true,
      message: 'Enrollment successful',
      data: { courseId: course._id.toString() }
    }, { status: 200 });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}

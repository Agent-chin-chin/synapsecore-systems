import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';
import { createEnrollment, getEnrollmentsByLearner, updateEnrollment } from '@/lib/supabase/modules/enrollments';

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

    if (!courseId) {
      return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });
    }

    const existingEnrollments = await getEnrollmentsByLearner(user.id);
    const alreadyEnrolled = existingEnrollments.some((entry: any) => entry.course_id === courseId);
    if (alreadyEnrolled) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    const enrollment = await createEnrollment({
      learner_id: user.id,
      course_id: courseId,
      status: 'active',
      progress: 0,
      enrolled_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Enrollment successful',
      data: { courseId: enrollment.course_id }
    }, { status: 200 });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}

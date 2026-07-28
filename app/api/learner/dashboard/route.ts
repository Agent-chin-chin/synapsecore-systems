import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('learner_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (enrollmentsError) {
      throw enrollmentsError;
    }

    const enrolledCourses = (enrollments || []).map((enrollment: any) => ({
      courseId: enrollment.course_id || '',
      courseTitle: enrollment.course_title || 'Unknown Course',
      progress: enrollment.progress || 0,
      completedLessons: enrollment.completed_lessons || 0,
      totalLessons: enrollment.total_lessons || 0,
      status: enrollment.status || 'enrolled',
      enrolledAt: enrollment.enrolled_at
    }));

    return NextResponse.json({
      learner: {
        id: user.id,
        fullName: user.email?.split('@')[0] || 'Learner',
        email: user.email
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

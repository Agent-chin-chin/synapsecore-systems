import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Enrollment from '@/lib/models/Enrollment';
import Course from '@/lib/models/Course';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    // Get enrolled courses for this learner
    const enrollments = await Enrollment.find({ learnerId: user.id }).populate('courseId');

    // Extract resources from enrolled courses
    const resources = enrollments.flatMap((enrollment: any) => {
      const course = enrollment.courseId;
      const baseResources = (course?.modules || []).flatMap((module: any, moduleIdx: number) =>
        (module.lessons || []).flatMap((lesson: any, lessonIdx: number) => [
          {
            id: `${course._id}-${moduleIdx}-${lessonIdx}-video`,
            title: `${lesson.title} - Video Lesson`,
            type: 'video',
            url: lesson.videoUrl || '#',
            courseTitle: course.title,
            description: lesson.description || ''
          },
          ...(lesson.resourcesUrl ? [{
            id: `${course._id}-${moduleIdx}-${lessonIdx}-resource`,
            title: `${lesson.title} - Resources`,
            type: 'document',
            url: lesson.resourcesUrl,
            courseTitle: course.title,
            description: 'Course materials and references'
          }] : [])
        ])
      );
      return baseResources;
    });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Resources error:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

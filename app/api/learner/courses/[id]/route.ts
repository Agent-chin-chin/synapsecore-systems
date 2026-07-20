import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Course from '@/lib/models/Course';
import Enrollment from '@/lib/models/Enrollment';
import { authenticateAPI } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';

interface CourseDoc {
  _id: string;
  published?: boolean;
  [key: string]: any;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
    }

    await connectDB();

    const course = await Course.findById(id).lean() as CourseDoc | null;
    if (!course || !course.published) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Determine enrollment for the requesting learner (if any).
    const user = authenticateAPI(request);
    let enrolled = false;
    if (user && user.role === 'learner') {
      const existing = await Enrollment.findOne({ learnerId: user.id, courseId: id }).lean();
      enrolled = Boolean(existing);
    }

    // Public catalog data always safe. Lesson video/download URLs are only
    // returned to enrolled learners to prevent unauthorized access to paid content.
    if (!enrolled) {
      const safeCourse = JSON.parse(JSON.stringify(course));
      (safeCourse.modules || []).forEach((mod: any) => {
        (mod.lessons || []).forEach((lesson: any) => {
          lesson.videos = [];
          if (lesson.downloads) lesson.downloads = [];
        });
      });
      safeCourse.enrolled = false;
      return NextResponse.json(safeCourse, { status: 200 });
    }

    course.enrolled = true;
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error('Course detail fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}

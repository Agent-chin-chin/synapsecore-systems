import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import Course from '@/lib/models/Course';
import Enrollment from '@/lib/models/Enrollment';
import { authenticateAPI } from '@/lib/apiAuth';

interface LessonProgressEntry {
  moduleIndex: number;
  lessonIndex: number;
  completed: boolean;
  completedAt?: Date;
}

interface EnrollmentDoc {
  lessonProgress?: LessonProgressEntry[];
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return unauthorized();
  }

  const courseId = request.nextUrl.searchParams.get('courseId');
  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return badRequest('Valid courseId is required');
  }

  await connectDB();

  const enrollment = await Enrollment.findOne({ learnerId: user.id, courseId }).lean() as EnrollmentDoc | null;
  if (!enrollment) {
    return NextResponse.json({ completedLessons: [] }, { status: 200 });
  }

  const completedLessons = ((enrollment.lessonProgress || []) as LessonProgressEntry[])
    .filter((entry) => entry.completed)
    .map((entry) => ({ moduleIndex: entry.moduleIndex, lessonIndex: entry.lessonIndex }));

  return NextResponse.json({ completedLessons }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return unauthorized();
  }

  const body = await request.json();
  const { courseId, moduleIndex, lessonIndex, completed } = body;

  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return badRequest('Valid courseId is required');
  }

  if (typeof moduleIndex !== 'number' || typeof lessonIndex !== 'number') {
    return badRequest('moduleIndex and lessonIndex are required');
  }

  if (completed !== true) {
    return badRequest('Completed must be true to mark lesson completion');
  }

  await connectDB();

  const course = await Course.findById(courseId).lean();
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  const enrollment = await Enrollment.findOne({ learnerId: user.id, courseId });
  if (!enrollment) {
    return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
  }

  const existing = enrollment.lessonProgress?.find((entry: LessonProgressEntry) =>
    entry.moduleIndex === moduleIndex && entry.lessonIndex === lessonIndex
  );

  if (!existing) {
    enrollment.lessonProgress = enrollment.lessonProgress || [];
    enrollment.lessonProgress.push({
      moduleIndex,
      lessonIndex,
      completed: true,
      completedAt: new Date()
    });
  } else {
    existing.completed = true;
    existing.completedAt = existing.completedAt || new Date();
  }

  const totalLessons = ((course as any).modules || []).reduce((sum: number, module: any) => {
    return sum + ((module.lessons && module.lessons.length) || 0);
  }, 0);

  const completedCount = ((enrollment.lessonProgress || []) as LessonProgressEntry[]).filter((entry) => entry.completed).length;
  enrollment.progress = enrollment.progress || {};
  enrollment.progress.completedLessons = completedCount;
  enrollment.progress.totalLessons = totalLessons;
  enrollment.progress.progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  enrollment.progress.lastAccessedAt = new Date();

  await enrollment.save();

  return NextResponse.json({ success: true, completedLessons: completedCount }, { status: 200 });
}

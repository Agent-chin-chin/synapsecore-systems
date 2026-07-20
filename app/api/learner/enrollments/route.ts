import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import Enrollment from '@/lib/models/Enrollment';
import Course from '@/lib/models/Course';
import { authenticateAPI } from '@/lib/apiAuth';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user) return unauthorized();

  await connectDB();

  const enrollments = await Enrollment.find({ learnerId: user.id })
    .sort({ enrolledAt: -1 })
    .populate('courseId', 'title description level duration instructor price category thumbnail')
    .lean();

  const result = enrollments.map((e: any) => ({
    enrollmentId: e._id,
    status: e.status,
    progress: e.progress || { completedLessons: 0, totalLessons: 0, progressPercentage: 0 },
    enrolledAt: e.enrolledAt,
    course: e.courseId,
    certificate: e.certificate || { earned: false },
  }));

  return NextResponse.json({ enrollments: result }, { status: 200 });
}

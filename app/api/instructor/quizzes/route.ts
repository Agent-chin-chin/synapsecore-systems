import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import Quiz from '@/lib/models/Quiz';
import Course from '@/lib/models/Course';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// GET /api/instructor/quizzes - list quizzes (optionally by courseId)
export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const idsParam = searchParams.get('ids');

  await connectDB();
  const filter: any = {};
  if (courseId) filter.courseId = courseId;
  if (idsParam) {
    const ids = idsParam.split(',').filter((id) => mongoose.Types.ObjectId.isValid(id));
    filter._id = { $in: ids };
  }

  const quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(quizzes, { status: 200 });
}

// POST /api/instructor/quizzes - create quiz
export async function POST(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const body = await request.json();
  await connectDB();

  const quiz = new Quiz({
    title: body.title,
    description: body.description || '',
    scope: body.scope || 'module',
    questions: body.questions || [],
    passingScore: body.passingScore ?? 70,
    courseId: body.courseId || null,
    createdBy: user._id || user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await quiz.save();
  return NextResponse.json(quiz, { status: 201 });
}

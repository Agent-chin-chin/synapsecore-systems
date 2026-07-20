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

// GET /api/instructor/quizzes/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid quiz id' }, { status: 400 });
  }

  await connectDB();
  const quiz = await Quiz.findById(id).lean();
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  return NextResponse.json(quiz, { status: 200 });
}

// PUT /api/instructor/quizzes/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid quiz id' }, { status: 400 });
  }

  const body = await request.json();
  await connectDB();

  const quiz = await Quiz.findByIdAndUpdate(
    id,
    { ...body, updatedAt: new Date() },
    { new: true }
  ).lean();
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  return NextResponse.json(quiz, { status: 200 });
}

// DELETE /api/instructor/quizzes/[id] - also detach references from courses
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid quiz id' }, { status: 400 });
  }

  await connectDB();
  const result = await Quiz.findByIdAndDelete(id);
  if (!result) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  // detach from modules/lessons
  await Course.updateMany(
    { 'modules.quiz.quizId': result._id },
    { $set: { 'modules.$[].quiz': undefined } }
  );
  await Course.updateMany(
    { 'modules.lessons.quiz.quizId': result._id },
    { $set: { 'modules.$[].lessons.$[].quiz': undefined } }
  );

  return NextResponse.json({ success: true }, { status: 200 });
}

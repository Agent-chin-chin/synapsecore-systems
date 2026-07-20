import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import Course from '@/lib/models/Course';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

async function loadCourse(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Course.findById(id);
}

// POST /api/instructor/courses/[id]/modules/[moduleId]/lessons - add lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id, moduleId } = await params;
  const body = await request.json();
  await connectDB();

  const course = await loadCourse(id);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  const mod = course.modules.id(moduleId);
  if (!mod) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  mod.lessons.push({
    title: body.title || 'New Lesson',
    description: body.description || '',
    notes: body.notes || '',
    videos: body.videos || [],
    duration: body.duration || 0,
    order: mod.lessons.length + 1,
    downloads: body.downloads || [],
    quiz: body.quiz || undefined,
    assignment: body.assignment || undefined,
    discussionEnabled: body.discussionEnabled ?? false,
    subtitles: body.subtitles || [],
    playground: body.playground || { enabled: false, kind: '' },
    aiTutor: body.aiTutor || { enabled: false },
  });
  course.updatedAt = new Date();
  await course.save();

  return NextResponse.json(mod.lessons[mod.lessons.length - 1], { status: 201 });
}

// PUT /api/instructor/courses/[id]/modules/[moduleId]/lessons - update lesson (body.lessonId)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id, moduleId } = await params;
  const body = await request.json();
  await connectDB();

  const course = await loadCourse(id);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  const mod = course.modules.id(moduleId);
  if (!mod) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  const lesson = mod.lessons.id(body.lessonId);
  if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

  const fields = [
    'title', 'description', 'notes', 'videos', 'duration', 'downloads',
    'quiz', 'assignment', 'discussionEnabled', 'subtitles', 'playground', 'aiTutor', 'order',
  ];
  for (const f of fields) {
    if (body[f] !== undefined) (lesson as any)[f] = body[f];
  }
  course.updatedAt = new Date();
  await course.save();

  return NextResponse.json(lesson, { status: 200 });
}

// DELETE /api/instructor/courses/[id]/modules/[moduleId]/lessons - remove lesson (body.lessonId)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id, moduleId } = await params;
  const body = await request.json();
  await connectDB();

  const course = await loadCourse(id);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  const mod = course.modules.id(moduleId);
  if (!mod) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  mod.lessons.id(body.lessonId)?.deleteOne();
  course.updatedAt = new Date();
  await course.save();

  return NextResponse.json({ success: true }, { status: 200 });
}

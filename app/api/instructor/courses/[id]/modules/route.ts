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

// POST /api/instructor/courses/[id]/modules - add a module
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  await connectDB();

  const course = await loadCourse(id);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  course.modules.push({
    title: body.title || 'New Module',
    description: body.description || '',
    notes: body.notes || '',
    order: course.modules.length + 1,
    lessons: [],
    unlockRule: body.unlockRule || 'videoComplete',
    assignment: body.assignment || undefined,
  });
  course.updatedAt = new Date();
  await course.save();

  return NextResponse.json(course.modules[course.modules.length - 1], { status: 201 });
}

// PUT /api/instructor/courses/[id]/modules - update a module (body.moduleId)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  await connectDB();

  const course = await loadCourse(id);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  const mod = course.modules.id(body.moduleId);
  if (!mod) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  mod.title = body.title ?? mod.title;
  mod.description = body.description ?? mod.description;
  mod.notes = body.notes ?? mod.notes;
  mod.order = body.order ?? mod.order;
  mod.unlockRule = body.unlockRule ?? mod.unlockRule;
  mod.assignment = body.assignment ?? mod.assignment;
  mod.quiz = body.quiz ?? mod.quiz;
  course.updatedAt = new Date();
  await course.save();

  return NextResponse.json(mod, { status: 200 });
}

// DELETE /api/instructor/courses/[id]/modules - remove a module (body.moduleId)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  await connectDB();

  const course = await loadCourse(id);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  course.modules.id(body.moduleId)?.deleteOne();
  course.updatedAt = new Date();
  await course.save();

  return NextResponse.json({ success: true }, { status: 200 });
}

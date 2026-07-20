import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import Course from '@/lib/models/Course';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// GET /api/instructor/courses/[id] - full course with modules/lessons
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
  }

  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  return NextResponse.json(course, { status: 200 });
}

// PUT /api/instructor/courses/[id] - update course metadata + full modules tree
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
  }

  const body = await request.json();
  await connectDB();

  const course = await Course.findByIdAndUpdate(
    id,
    { ...body, updatedAt: new Date() },
    { new: true }
  ).lean();

  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  return NextResponse.json(course, { status: 200 });
}

// DELETE /api/instructor/courses/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) return unauthorized();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
  }

  await connectDB();
  const result = await Course.findByIdAndDelete(id);
  if (!result) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  return NextResponse.json({ success: true }, { status: 200 });
}

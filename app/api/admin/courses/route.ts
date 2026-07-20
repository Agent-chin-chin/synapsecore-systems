import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Course from '@/lib/models/Course';
import connectDB from '@/lib/mongoose';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const user = await authenticateAPI(request);
  if (!user || !isAdmin(user)) {
    return unauthorized();
  }

  await connectDB();
  const courses = await Course.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(courses, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await authenticateAPI(request);
  if (!user || !isAdmin(user)) {
    return unauthorized();
  }

  const body = await request.json();

  await connectDB();
  const course = new Course({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
    published: body.published ?? true,
    featured: body.featured ?? false,
  });

  await course.save();
  return NextResponse.json(course, { status: 201 });
}

// app/api/learner/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Course from '@/lib/models/Course';
import connectDB from '@/lib/mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    const query: any = { published: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

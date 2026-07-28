// app/api/learner/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listPublishedCourses } from '@/lib/supabase/modules/learner-courses';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.search = search;

    const courses = await listPublishedCourses(filter);

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

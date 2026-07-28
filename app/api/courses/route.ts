import { NextRequest, NextResponse } from 'next/server';
import { listCourses, createCourse } from '@/lib/supabase/modules/courses';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await listCourses(filter);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      level,
      price,
      duration,
      thumbnail,
      notes,
      modules,
      quizzes,
      certificate,
      instructor,
    } = body;

    if (!title || !category || !level) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, level' },
        { status: 400 }
      );
    }

    const course = await createCourse({
      title,
      description: description || '',
      category,
      level,
      price: price || 0,
      duration: duration || '',
      thumbnail: thumbnail || '',
      notes: notes || {},
      modules: modules || [],
      quizzes: quizzes || [],
      certificate: certificate || { enabled: true },
      instructor: instructor || {},
    });

    return NextResponse.json(
      { message: 'Course created successfully', course },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: 500 }
    );
  }
}

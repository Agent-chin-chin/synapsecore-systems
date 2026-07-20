import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Course from '@/lib/models/Course';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    const filter: any = {};
    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await Course.find(filter)
      .select('title category level price duration description instructor')
      .sort({ category: 1, level: 1, price: 1 })
      .lean();

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
    await connectDB();

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

    const course = new Course({
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

    await course.save();

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

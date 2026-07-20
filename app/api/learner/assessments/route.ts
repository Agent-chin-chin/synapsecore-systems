import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Enrollment from '@/lib/models/Enrollment';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || user.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const enrollments = await Enrollment.find({ learnerId: user.id }).populate('courseId', 'title modules').lean();

    const assessments: any[] = [];
    for (const enrollment of enrollments) {
      const course = enrollment.courseId as any;
      const modules = course?.modules || [];
      let lessonIndex = 0;
      for (const module of modules) {
        const lessons = module.lessons || [];
        for (const lesson of lessons) {
          if (lesson.title?.toLowerCase().includes('quiz') || lesson.title?.toLowerCase().includes('assessment') || lesson.title?.toLowerCase().includes('exam')) {
            const enrollmentAssessment = (enrollment as any).assessments?.find((a: any) => a.quizId?.toString() === lesson._id?.toString());
            assessments.push({
              id: `${enrollment._id}-${lessonIndex}`,
              courseId: course._id,
              courseTitle: course.title,
              title: lesson.title,
              description: lesson.description || 'Complete this assessment to test your knowledge.',
              status: enrollmentAssessment ? (enrollmentAssessment.passed ? 'completed' : 'in-progress') : 'not-started',
              score: enrollmentAssessment?.score,
              maxScore: 100,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
          }
          lessonIndex++;
        }
      }
    }

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Assessments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

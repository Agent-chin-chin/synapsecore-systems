import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import Enrollment from '@/lib/models/Enrollment';
import Course from '@/lib/models/Course';
import SupportTicket from '@/lib/models/Support';
import Payment from '@/lib/models/Payment';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) {
    return unauthorized();
  }

  await connectDB();

  const [learners, enrollments, courses, supportTickets, payments] = await Promise.all([
    User.find({ role: 'learner' }).sort({ createdAt: -1 }).lean(),
    Enrollment.find().populate('courseId', 'title').lean(),
    Course.find().lean(),
    SupportTicket.find().sort({ createdAt: -1 }).lean(),
    Payment.find().lean(),
  ]);

  const paymentsByLearner = payments.reduce((acc, payment) => {
    if (payment.learnerId) {
      const key = String(payment.learnerId);
      if (!acc[key]) acc[key] = [];
      acc[key].push(payment);
    }
    return acc;
  }, {} as Record<string, any[]>);

  const normalizedLearners = learners.map((learner) => {
    const learnerEnrollments = enrollments.filter((item) => String(item.learnerId) === String(learner._id));
    const approvedCount = learnerEnrollments.filter((item) => item.status === 'active' || item.status === 'completed').length;
    const avgProgress = learnerEnrollments.length
      ? Math.round(learnerEnrollments.reduce((total, item) => total + (item.progress?.progressPercentage || 0), 0) / learnerEnrollments.length)
      : 0;
    const learnerPayments = paymentsByLearner[String(learner._id)] || [];
    const latestPayment = learnerPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      id: learner._id,
      name: learner.fullname || learner.email,
      email: learner.email,
      profilePicture: learner.learnerProfile?.profilePicture || '',
      dateOfBirth: learner.learnerProfile?.dateOfBirth || '',
      gender: learner.learnerProfile?.gender || '',
      nationality: learner.learnerProfile?.nationality || '',
      city: learner.learnerProfile?.city || '',
      country: learner.learnerProfile?.country || '',
      phone: learner.phone || '',
      experience: learner.experience || 'New learner',
      status: learner.status,
      approvalStatus: learner.status,
      enrolledCourses: learnerEnrollments.length,
      progress: avgProgress,
      lastActive: learner.updatedAt ? new Date(learner.updatedAt).toLocaleDateString() : 'Never',
      paymentStatus: latestPayment ? latestPayment.status : 'none',
      selectedCourse: learner.learnerProfile?.selectedCourse || '',
      paymentPlan: learner.learnerProfile?.paymentPlanPreference || '',
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalLearners: learners.length,
        activeLearners: learners.filter((learner) => learner.status === 'approved').length,
        pendingApproval: learners.filter((learner) => learner.status === 'pending').length,
        suspendedLearners: learners.filter((learner) => learner.status === 'suspended').length,
        totalEnrollments: enrollments.length,
        averageProgress: Math.round(enrollments.reduce((total, item) => total + (item.progress?.progressPercentage || 0), 0) / Math.max(enrollments.length, 1)),
        certificationsIssued: enrollments.filter((item) => item.certificate?.earned).length,
        supportTickets: supportTickets.length,
      },
      learners: normalizedLearners,
      courses: courses.map((course) => ({
        title: course.title,
        enrolled: enrollments.filter((item) => String(item.courseId) === String(course._id)).length,
      })),
    },
  });
}

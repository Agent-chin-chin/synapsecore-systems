import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import Enrollment from '@/lib/models/Enrollment';

interface CreateEnrollmentResult {
  created: boolean;
  enrollment?: any;
  reason?: string;
}

/**
 * Idempotently create an enrollment for a learner after a successful payment.
 * Mirrors the logic in POST /api/learner/enroll but driven by a confirmed payment.
 */
export async function createEnrollmentForPayment(learnerId: string, courseId: string): Promise<CreateEnrollmentResult> {
  await connectDB();

  const course = await Course.findById(courseId);
  if (!course) {
    return { created: false, reason: 'Course not found' };
  }

  const learner = await User.findById(learnerId);
  if (!learner) {
    return { created: false, reason: 'Learner not found' };
  }

  const existing = await Enrollment.findOne({ learnerId, courseId });
  if (existing) {
    if (existing.status === 'active') {
      return { created: false, reason: 'Already enrolled', enrollment: existing };
    }
    existing.status = 'active';
    await existing.save();
    return { created: false, reason: 'Reactivated', enrollment: existing };
  }

  const totalLessons = (course.modules as any[] || []).reduce((sum: number, module: any) => {
    return sum + ((module.lessons && module.lessons.length) || 0);
  }, 0);

  // Atomic upsert: the unique index on { learnerId, courseId } guarantees only
  // ONE enrollment can ever exist, even if the webhook retries or verify + webhook race.
  const result = await (Enrollment as any).findOneAndUpdate(
    { learnerId: learner._id, courseId: course._id },
    {
      $setOnInsert: {
        learnerId: learner._id,
        courseId: course._id,
        status: 'active',
        progress: {
          completedLessons: 0,
          totalLessons,
          progressPercentage: 0,
          lastAccessedAt: new Date(),
        },
        totalTimeSpent: 0,
      },
    },
    { upsert: true, new: true, rawResult: true, setDefaultsOnInsert: true }
  ) as any;

  const wasNew = Boolean(result.lastErrorObject?.upserted);
  const enrollment = result.value || result;

  // Idempotent: only add to the learner's enrolledCourses list if not already present.
  await User.updateOne(
    { _id: learner._id, "learnerProfile.enrolledCourses.courseId": { $ne: course._id } },
    {
      $push: {
        "learnerProfile.enrolledCourses": {
          courseId: course._id,
          enrolledAt: new Date(),
          status: 'enrolled',
          progress: 0,
        },
      },
    }
  );

  // Only count a brand-new enrollment toward enrollmentCount.
  if (wasNew) {
    await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } });
  }

  return { created: wasNew, enrollment };
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import Enrollment from '@/lib/models/Enrollment';

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Delete all learners
    const learners = await User.find({ role: 'learner' });
    const learnerIds = learners.map(l => l._id);

    const deleteResult = await User.deleteMany({ role: 'learner' });
    
    // Also delete their enrollments
    await Enrollment.deleteMany({ learnerId: { $in: learnerIds } });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} learner(s)`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Error deleting learners:', error);
    return NextResponse.json({ error: 'Failed to delete learners' }, { status: 500 });
  }
}

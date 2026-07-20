import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { authenticateAPI } from '@/lib/apiAuth';

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullname, bio, learningGoals, location, experience } = body;

    await connectDB();

    const update: any = {};
    if (fullname !== undefined) update.name = fullname;
    if (bio !== undefined || learningGoals !== undefined || experience !== undefined || location !== undefined) {
      update['learnerProfile'] = {
        ...(bio !== undefined ? { bio } : {}),
        ...(learningGoals !== undefined ? { learningGoals } : {}),
        ...(experience !== undefined ? { experience } : {}),
        ...(location !== undefined ? { location } : {})
      };
    }

    const updated = await User.findByIdAndUpdate(user.id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

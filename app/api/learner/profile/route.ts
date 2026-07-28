import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';
import { updateUserProfile } from '@/services/userService';

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullname, bio, learningGoals, location, experience } = body;

    const update: any = {};
    if (fullname !== undefined) update.fullname = fullname;
    if (bio !== undefined || learningGoals !== undefined || experience !== undefined || location !== undefined) {
      update.learnerProfile = {
        ...(bio !== undefined ? { bio } : {}),
        ...(learningGoals !== undefined ? { learningGoals } : {}),
        ...(experience !== undefined ? { experience } : {}),
        ...(location !== undefined ? { location } : {}),
      };
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const updated = await updateUserProfile(user.id, update);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

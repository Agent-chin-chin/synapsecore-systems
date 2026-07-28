import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPI } from '@/lib/apiAuth';
import { getUserById, updateUserProfile } from '@/services/userService';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserById(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const settings = profile?.user_metadata?.settings || profile?.settings || {};
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching learner settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const settings = body.settings;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    const updated = await updateUserProfile(user.id, { settings });
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updated.user_metadata?.settings || updated.settings || {} });
  } catch (error) {
    console.error('Error updating learner settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

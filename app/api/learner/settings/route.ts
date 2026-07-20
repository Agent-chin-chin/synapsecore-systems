import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const profile = await User.findById(user.id).select('settings').lean();
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: profile.settings || {} });
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

    await connectDB();

    const body = await request.json();
    const settings = body.settings;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      user.id,
      { $set: { settings, updatedAt: new Date() } },
      { new: true }
    ).select('settings');

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updated.settings });
  } catch (error) {
    console.error('Error updating learner settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

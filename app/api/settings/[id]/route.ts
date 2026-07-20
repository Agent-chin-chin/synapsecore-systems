import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Settings from '@/lib/models/Settings';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const { key, value, description, category } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields: key, value' }, { status: 400 });
    }

    const updated = await Settings.findByIdAndUpdate(
      id,
      { key, value, description, category },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Setting with this key already exists' }, { status: 409 });
    }
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

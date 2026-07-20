import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import Settings from '@/lib/models/Settings';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await connectDB();
    const settings = await Settings.find().lean();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { key, value, description, category } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields: key, value' }, { status: 400 });
    }

    const setting = await Settings.create({ key, value, description, category });
    return NextResponse.json({ success: true, setting }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Setting with this key already exists' }, { status: 409 });
    }
    console.error('Error creating setting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
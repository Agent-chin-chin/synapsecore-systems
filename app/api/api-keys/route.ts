import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ApiKey from '@/lib/models/ApiKey';
import crypto from 'crypto';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user || !requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const apiKeys = await ApiKey.find().populate('user', 'fullname email').lean();
    return NextResponse.json({ success: true, apiKeys });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user || !requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { label, scopes } = await request.json();

    const key = crypto.randomBytes(32).toString('hex');
    const apiKey = await ApiKey.create({
      key,
      user: user.id,
      label: label || 'Unnamed Key',
      scopes: scopes || ['read'],
      active: true
    });

    return NextResponse.json({ success: true, apiKey });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

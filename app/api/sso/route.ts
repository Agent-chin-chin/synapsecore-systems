import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';

// In-memory SSO provider storage (replace with DB model in production)
let ssoProviders: any[] = [];

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
    return NextResponse.json({ success: true, providers: ssoProviders });
  } catch (error) {
    console.error('Error fetching SSO providers:', error);
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

    const body = await request.json();
    const { name, type, config, domains } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields: name, type' }, { status: 400 });
    }

    const provider = {
      id: Date.now().toString(),
      name,
      type,
      config: config || {},
      domains: domains || [],
      enabled: false,
      createdAt: new Date(),
      createdBy: user.id
    };

    ssoProviders.push(provider);
    return NextResponse.json({ success: true, provider }, { status: 201 });
  } catch (error) {
    console.error('Error creating SSO provider:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
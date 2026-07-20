import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { enabled } = body;

    // In production, update the database
    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling SSO provider:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
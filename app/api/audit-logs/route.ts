import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { getAuditLogs } from '@/services/auditLogService';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const actorId = searchParams.get('actorId') || undefined;
    const action = searchParams.get('action') || undefined;
    const targetType = searchParams.get('targetType') || undefined;
    const targetId = searchParams.get('targetId') || undefined;
    const result = await getAuditLogs({ page, limit, actorId, action, targetType, targetId });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, isAdmin } from '@/lib/guards';

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromRequest(request);
  const decoded = token ? await verifyToken(token) : null;

  return NextResponse.json({
    cookieHeader,
    token,
    decoded,
    isAdmin: isAdmin(decoded),
  });
}

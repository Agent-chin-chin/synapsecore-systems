import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBookings } from '@/services/bookingService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') || undefined;
    const serviceType = searchParams.get('serviceType') || undefined;
    const result = await getBookings({ page, limit, status, serviceType });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

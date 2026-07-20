import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import SupportTicket from '@/lib/models/Support';
import connectDB from '@/lib/mongoose';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();
    const ticket = await SupportTicket.findByIdAndUpdate(id, body, { new: true });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

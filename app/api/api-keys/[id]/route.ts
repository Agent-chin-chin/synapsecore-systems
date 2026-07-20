import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import ApiKey from '@/lib/models/ApiKey';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = authenticateAPI(request);
    if (!user || !requireRole(user, 'admin', 'Super Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    await ApiKey.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
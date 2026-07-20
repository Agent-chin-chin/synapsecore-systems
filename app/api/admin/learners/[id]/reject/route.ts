import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) {
    return unauthorized();
  }

  const { id } = await params;
  await connectDB();
  const learner = await User.findByIdAndUpdate(id, { status: 'rejected', updatedAt: new Date() }, { new: true });

  if (!learner) {
    return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, learner });
}

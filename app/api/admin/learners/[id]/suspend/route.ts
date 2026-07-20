import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/lib/models/User';
import Notification from '@/lib/models/Notification';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';
import { sendNotificationEmail } from '@/lib/email';

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
  const learner = await User.findByIdAndUpdate(id, { status: 'suspended', updatedAt: new Date() }, { new: true });

  if (!learner) {
    return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
  }

  if (learner.email) {
    try {
      await Notification.create({
        recipientId: learner._id,
        senderId: user._id,
        type: 'user_action_required',
        title: 'Account Suspended',
        message: 'Your account has been suspended. Please contact support for more information.',
        category: 'system',
        priority: 'high',
      });
    } catch (notificationError) {
      console.error('Error creating suspension notification:', notificationError);
    }

    try {
      await sendNotificationEmail(
        { email: learner.email, fullname: learner.fullname || learner.email },
        'Account Suspended',
        'Your account has been suspended. Please contact support for more information.'
      );
    } catch (emailError) {
      console.error('Error sending suspension email:', emailError);
    }
  }

  return NextResponse.json({ success: true, learner });
}

import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/lib/models/Notification';
import { authenticateAPI } from '@/lib/apiAuth';
import { isAdmin } from '@/lib/guards';
import { sendNotificationEmail } from '@/lib/email';
import { updateUserStatus } from '@/services/userService';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = authenticateAPI(request);
  if (!user || !isAdmin(user)) {
    return unauthorized();
  }

  const { id } = await params;
  const learner = await updateUserStatus(id, 'approved');

  if (!learner) {
    return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
  }

  if (learner.email) {
    try {
      await Notification.create({
        recipientId: learner._id,
        senderId: user._id,
        type: 'user_action_required',
        title: 'Account Reactivated',
        message: 'Your account has been reactivated. You can now access the platform.',
        category: 'system',
        priority: 'medium',
      });
    } catch (notificationError) {
      console.error('Error creating reactivation notification:', notificationError);
    }

    try {
      await sendNotificationEmail(
        { email: learner.email, fullname: learner.fullname || learner.email },
        'Account Reactivated',
        'Your account has been reactivated. You can now access the platform.'
      );
    } catch (emailError) {
      console.error('Error sending reactivation email:', emailError);
    }
  }

  return NextResponse.json({ success: true, learner });
}

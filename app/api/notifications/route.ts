import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import Incident from '@/lib/models/Incident';
import User from '@/lib/models/User';
import Notification from '@/lib/models/Notification';
import { sendNotificationEmail } from '@/lib/email';

/**
 * Notification System for Cybersecurity Platform
 * Handles notifications for:
 * - incident assigned
 * - status updated
 * - note added
 * - incident resolved
 */

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const unreadOnly = searchParams.get('unread') === 'true';

    const query: any = { recipientId: user.id };
    if (unreadOnly) query.isRead = false;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ recipientId: user.id, isRead: false })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { type, recipientId, incidentId, title, message, priority, category, actionUrl, metadata } = body;

    if (!type || !recipientId || !incidentId || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: type, recipientId, incidentId, title, message' },
        { status: 400 }
      );
    }

    const validTypes = [
      'incident_assigned',
      'incident_updated',
      'incident_resolved',
      'threat_detected',
      'system_alert',
      'maintenance_scheduled',
      'security_update',
      'user_action_required',
      'report_generated',
      'billing_alert'
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Invalid notification type. Must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const notification = new Notification({
      recipientId,
      senderId: user.id,
      type,
      title,
      message,
      priority: priority || 'medium',
      category: category || 'incidents',
      actionUrl,
      metadata,
      isRead: false
    });

    await notification.save();

    try {
      await sendNotificationEmail({
        to: recipient.email,
        subject: `[CyberBugFixer] ${title}`,
        body: `Hello ${recipient.fullname},\n\n${message}\n\nIncident ID: ${incidentId}\nPriority: ${notification.priority}\n\nYou can view this incident in your dashboard.\n\nBest regards,\nCyberBugFixer Security Team`
      });
    } catch (emailError) {
      console.warn('Failed to send email notification:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Notification created successfully', data: notification }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: user.id },
      { isRead: true, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const deleteAll = searchParams.get('all') === 'true';

    if (deleteAll) {
      await Notification.deleteMany({ recipientId: user.id });
      return NextResponse.json({ success: true, message: 'All notifications cleared successfully' });
    }

    await Notification.deleteMany({ recipientId: user.id, isRead: true });
    return NextResponse.json({ success: true, message: 'Read notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

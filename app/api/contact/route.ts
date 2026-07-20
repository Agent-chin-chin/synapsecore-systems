/**
 * DEPRECATED: This route has been replaced by /api/support
 * Please use /api/support for all support ticket management operations.
 * This route will be removed in a future release.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import Message from '@/lib/models/Message';

// DEPRECATED - replaced by support
// Keep this route available until the support ticket system is fully validated
// Do not use this route in frontend UI anymore
// GET: Retrieve all messages (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Require admin access to view messages
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Create a new message (public)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    return NextResponse.json(
      { message: 'Message sent successfully', data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
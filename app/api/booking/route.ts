/**
 * DEPRECATED: This route has been replaced by /api/incidents
 * Please use /api/incidents for all incident management operations.
 * This route will be removed in a future release.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import Booking from '@/lib/models/Booking';

// DEPRECATED - replaced by incidents
// Keep this route available until the incident system is fully validated
// Do not use this route in frontend UI anymore
// GET: Retrieve all bookings with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const serviceType = searchParams.get('serviceType');
    const priority = searchParams.get('priority');

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (priority) filter.priority = priority;

    // Non-admin users can only see their own bookings
    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      filter.userId = user.id;
    }

    const bookings = await Booking.find(filter)
      .populate('userId', 'fullname email')
      .populate('assignedTo', 'fullname');

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Create a new booking
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, serviceType, description, priority, attachments } = body;

    // Validate required fields
    if (!serviceType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceType, description' },
        { status: 400 }
      );
    }

    // Non-admin users can only create bookings for themselves
    const bookingUserId = requireRole(user, 'Super Admin', 'Support Engineer')
      ? userId || user.id
      : user.id;

    const booking = new Booking({
      userId: bookingUserId,
      serviceType,
      description,
      priority: priority || 'medium',
      attachments: attachments || [],
    });

    await booking.save();

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
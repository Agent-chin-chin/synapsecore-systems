import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Booking from '@/lib/models/Booking';
import { authenticateAPI } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') || undefined;

    const query: any = { userId: user.id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('assignedTo', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { serviceType, description, priority, attachments } = body;

    if (!serviceType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceType, description' },
        { status: 400 }
      );
    }

    const booking = new Booking({
      userId: user.id,
      serviceType,
      description,
      priority: priority || 'medium',
      attachments: attachments || [],
      status: 'pending'
    });

    await booking.save();

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

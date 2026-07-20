import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import Booking from '@/lib/models/Booking';

// GET: Retrieve payments with optional filtering
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
    const paymentMethod = searchParams.get('paymentMethod');

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // Non-admin users can only see their own payments
    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      filter.userId = user.id;
    } else if (searchParams.get('userId')) {
      // Admin can filter by userId
      filter.userId = searchParams.get('userId');
    }

    const payments = await Payment.find(filter)
      .populate('userId', 'fullname email')
      .populate('bookingId', 'serviceType description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Create a new payment record
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
    const { userId, amount, paymentMethod, transactionId, bookingId, description } = body;

    // Validate required fields
    if (!userId || amount === undefined || !paymentMethod || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, paymentMethod, transactionId' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 }
      );
    }

    // Non-admin users can only create payments for themselves
    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer') && userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot create payments for other users' },
        { status: 403 }
      );
    }

    // Check if transactionId already exists
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment with this transaction ID already exists' },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify booking exists if provided
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
    }

    const payment = new Payment({
      userId,
      amount,
      paymentMethod,
      transactionId,
      bookingId: bookingId || null,
      description: description || '',
    });

    await payment.save();
    
    // Return payment with populated user and booking info
    const populatedPayment = await Payment.findById(payment._id)
      .populate('userId', 'fullname email')
      .populate('bookingId', 'serviceType description');
    
    return NextResponse.json(
      { message: 'Payment recorded successfully', payment: populatedPayment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update payment status (e.g., mark as completed) - Admin only
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can update payment status
    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentId, status' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    )
      .populate('userId', 'fullname email')
      .populate('bookingId', 'serviceType description');

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Payment status updated successfully', payment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
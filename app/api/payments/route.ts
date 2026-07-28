import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import { listPayments, createPayment, updatePayment } from '@/lib/supabase/modules/payments';

// GET: Retrieve payments with optional filtering
export async function GET(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');

    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      filter.userId = user.id;
    } else {
      const uid = searchParams.get('userId');
      if (uid) filter.userId = uid;
    }

    const payments = await listPayments(filter);

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
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, amount, paymentMethod, transactionId, bookingId, description } = body;

    if (!userId || amount === undefined || !paymentMethod || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount, paymentMethod, transactionId' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 }
      );
    }

    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer') && userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot create payments for other users' },
        { status: 403 }
      );
    }

    const payment = await createPayment({
      user_id: userId,
      amount,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      booking_id: bookingId || null,
      description: description || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: 'Payment recorded successfully', payment },
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

    const body = await request.json();
    const { paymentId, status } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentId, status' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const payment = await updatePayment(paymentId, { status });

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
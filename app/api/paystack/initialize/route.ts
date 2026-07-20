import { NextRequest, NextResponse } from 'next/server';
import { initializePayment } from '@/lib/paystack';
import connectDB from '@/lib/mongoose';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';
import { authenticateAPI } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
  try {
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, courseId, amount, fullname } = body;

    if (!courseId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, amount' },
        { status: 400 }
      );
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Use the course's authoritative price; fall back to client-sent amount.
    const chargeAmount = course.price || amount;

    const learner = await User.findById(user.id);
    const payerEmail = email || learner?.email;
    if (!payerEmail) {
      return NextResponse.json({ error: 'A valid email is required to pay' }, { status: 400 });
    }

    const metadata: any = {
      courseId: String(courseId),
      learnerId: String(user.id),
      fullname: fullname || learner?.fullname || learner?.email || payerEmail,
      courseTitle: course.title,
    };

    const paymentData = await initializePayment({
      email: payerEmail,
      amount: chargeAmount,
      metadata,
    });

    const payment = new Payment({
      userId: user.id,
      learnerId: user.id,
      amount: chargeAmount,
      paymentMethod: 'paystack',
      transactionId: paymentData.reference,
      paymentReference: paymentData.reference,
      paymentGateway: 'paystack',
      courseId,
      bookingId: null,
      description: `Course payment: ${course.title}`,
      status: 'pending',
    });

    await payment.save();

    return NextResponse.json(
      {
        authorizationUrl: paymentData.authorization_url,
        reference: paymentData.reference,
        paymentId: payment._id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Paystack initialize error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}

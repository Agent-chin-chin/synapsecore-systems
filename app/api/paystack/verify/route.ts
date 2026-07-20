import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
import connectDB from '@/lib/mongoose';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import { createEnrollmentForPayment } from '@/lib/enrollment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.redirect(new URL('/learner/courses?payment=error&reason=missing-reference', request.url));
    }

    const payment = await Payment.findOne({ transactionId: reference });
    if (!payment) {
      return NextResponse.redirect(new URL('/learner/courses?payment=error&reason=not-found', request.url));
    }

    const paystackData = await verifyPayment(reference);
    const status =
      paystackData.status === 'success'
        ? 'completed'
        : paystackData.status === 'failed'
        ? 'failed'
        : 'pending';

    payment.status = status;
    payment.updatedAt = new Date();
    if (paystackData.paid_at) payment.paidAt = new Date(paystackData.paid_at);
    await payment.save();

    if (status === 'completed' && payment.courseId) {
      const result = await createEnrollmentForPayment(
        String(payment.learnerId || payment.userId),
        String(payment.courseId)
      );
      const redirectUrl = new URL('/learner/my-courses', request.url);
      redirectUrl.searchParams.set('payment', 'success');
      if (!result.created && result.reason === 'Already enrolled') {
        redirectUrl.searchParams.set('note', 'already-enrolled');
      }
      return NextResponse.redirect(redirectUrl);
    }

    if (status === 'failed') {
      return NextResponse.redirect(new URL('/learner/courses?payment=failed', request.url));
    }

    return NextResponse.redirect(new URL('/learner/courses?payment=pending', request.url));
  } catch (error: any) {
    console.error('Paystack verify error:', error);
    return NextResponse.redirect(new URL('/learner/courses?payment=error', request.url));
  }
}

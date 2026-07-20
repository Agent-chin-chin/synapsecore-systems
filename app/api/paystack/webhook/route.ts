import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyPayment } from '@/lib/paystack';
import connectDB from '@/lib/mongoose';
import Payment from '@/lib/models/Payment';
import User from '@/lib/models/User';
import config from '@/lib/config';
import { createEnrollmentForPayment } from '@/lib/enrollment';

function verifyPaystackSignature(secret: string, signature: string, body: Buffer) {
  const expected = crypto
    .createHmac('sha512', secret)
    .update(body)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || '');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const signature = request.headers.get('x-paystack-signature') || '';
    const bodyBuffer = Buffer.from(await request.text());

    // Paystack signs the webhook payload with the SECRET KEY (sk_live_... / sk_test_...).
    // We verify against PAYSTACK_SECRET_KEY, falling back to PAYSTACK_WEBHOOK_SECRET
    // only if it has been set to a separate value in the dashboard.
    const webhookSecret = config.PAYSTACK_SECRET_KEY || config.PAYSTACK_WEBHOOK_SECRET;
    if (!webhookSecret || !verifyPaystackSignature(webhookSecret, signature, bodyBuffer)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(bodyBuffer.toString('utf8'));

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const payment = await Payment.findOne({ transactionId: reference });

      if (!payment) {
        return NextResponse.json({ received: true, message: 'Payment record not found' }, { status: 200 });
      }

      payment.status = 'completed';
      payment.updatedAt = new Date();
      if (event.data.paid_at) payment.paidAt = new Date(event.data.paid_at);
      await payment.save();

      if (payment.courseId) {
        await createEnrollmentForPayment(
          String(payment.learnerId || payment.userId),
          String(payment.courseId)
        );
      }
    } else if (event.event === 'charge.failed') {
      const reference = event.data.reference;
      const payment = await Payment.findOne({ transactionId: reference });

      if (payment) {
        payment.status = 'failed';
        payment.updatedAt = new Date();
        await payment.save();
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

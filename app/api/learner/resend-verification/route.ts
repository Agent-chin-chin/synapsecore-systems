import { NextResponse } from 'next/server';
import { resendVerificationCode } from '../../../../services/authService';
import { sendNotificationEmail } from '../../../../lib/email';
import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await resendVerificationCode(email);
    const message = `Your new verification code is ${user.verificationCode}. Please enter it on the verification page.`;

    try {
      await sendNotificationEmail(
        { email: user.email, fullname: user.fullname },
        'Verification code resent',
        message
      );
    } catch (notifyError) {
      console.warn('Verification email failed to send:', notifyError);
    }

    if (user.phone) {
      try {
        await sendSMS(user.phone, message);
      } catch (smsError) {
        console.warn('SMS verification failed to send:', smsError);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Verification code resent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error resending verification code:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to resend verification code' },
      { status: 400 }
    );
  }
}

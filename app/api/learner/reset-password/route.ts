import { NextResponse } from 'next/server';
import { resetPassword } from '../../../../services/authService';
import { sendNotificationEmail } from '../../../../lib/email';

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: 'Email, reset code, and new password are required' },
        { status: 400 }
      );
    }

    const user = await resetPassword(email, code, newPassword);

    try {
      await sendNotificationEmail(
        { email: user.email, fullname: user.fullname },
        'Password reset successful',
        'Your password has been updated successfully. If you did not request this change, please contact support immediately.'
      );
    } catch (notificationError) {
      console.warn('Failed to send password reset notification:', notificationError);
    }

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to reset password' },
      { status: 400 }
    );
  }
}

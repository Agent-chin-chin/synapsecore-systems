import { NextResponse } from 'next/server';
import { verifyUserEmail } from '../../../../services/authService';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const user = await verifyUserEmail(email, code);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully. Wait for admin approval before logging in.',
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to verify email' },
      { status: 400 }
    );
  }
}

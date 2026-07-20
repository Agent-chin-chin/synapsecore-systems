import { NextResponse } from 'next/server';
import { requestPasswordReset } from '../../../../services/authService';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await requestPasswordReset(email);

    return NextResponse.json(
      { success: true, message: 'If that email exists, a reset code has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to request password reset' },
      { status: 400 }
    );
  }
}

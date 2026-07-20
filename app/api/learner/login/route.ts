import { NextResponse } from 'next/server';
import { loginUser } from '../../../../services/authService';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await loginUser({ email, password });

    const response = NextResponse.json(
      {
        success: true,
        token: result.token,
        user: result.user,
        message: 'Login successful'
      },
      { status: 200 }
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;

  } catch (error: any) {
    console.error('Error learner login:', error);
    let status = 500;
    let message = 'Server error';

    if (error instanceof Error) {
      message = error.message;
      if (message === 'Invalid email or password') {
        status = 401;
      } else if (
        message.includes('pending') ||
        message.includes('rejected') ||
        message.includes('not verified')
      ) {
        status = 403;
      }
    }

    return NextResponse.json({ message }, { status });
  }
}
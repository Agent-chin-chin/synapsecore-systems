import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { registerUser } from '@/services/authService';
import { cookies } from 'next/headers';

// POST: Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullname, email, phone, password, role } = body;
    
    // Validate required fields
    if (!fullname || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: fullname, email, phone, password' },
        { status: 400 }
      );
    }
    
    const result = await registerUser({ fullname, email, phone, password, role });
    
    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        user: result.user
        // Note: token is now in cookie, not in response body
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof Error && error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
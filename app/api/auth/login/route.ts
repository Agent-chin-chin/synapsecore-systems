import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { loginUser } from '@/services/authService';
import { loginSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Invalid login payload',
        status: 400,
        error: parsed.error.issues.map((issue) => issue.message).join(', ')
      });
    }

    const result = await loginUser(parsed.data);
    const adminRoles = ['Super Admin', 'Support Engineer', 'admin'];
    
    // Set httpOnly cookie on the JSON response so browsers accept it when using fetch
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: result.user,
        redirect: adminRoles.includes(result.user.role) ? '/admin/dashboard' : '/client/incidents'
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
    console.error('Error logging in user:', error);
    if (error instanceof Error && error.message === 'Invalid email or password') {
      return errorResponse({ message: error.message, status: 401 });
    }
    return errorResponse({ message: 'Internal Server Error', status: 500 });
  }
}
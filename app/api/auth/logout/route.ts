import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST: Logout user
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
   
  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}
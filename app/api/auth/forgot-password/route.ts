import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

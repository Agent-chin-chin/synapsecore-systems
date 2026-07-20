import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value || null;
  return NextResponse.json({ token });
}
